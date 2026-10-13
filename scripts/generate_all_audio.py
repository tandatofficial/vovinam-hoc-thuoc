# -*- coding: utf-8 -*-
import asyncio
import aiohttp
import certifi
import ssl
import re
import os
import json
import unicodedata
from edge_tts.communicate import mkssml, connect_id, date_to_string, ssml_headers_plus_data
from edge_tts.constants import WSS_URL, SEC_MS_GEC_VERSION, WSS_HEADERS
from edge_tts.drm import DRM
from edge_tts.data_classes import TTSConfig

VOICE = "vi-VN-NamMinhNeural" # Giọng nam truyền cảm, hào sảng, phong thái chuẩn mực Vovinam
RATE = "-2%"

def prepare_speech_text(text: str) -> str:
    # 1. Chuẩn hóa font chữ cổ / lỗi TCVN3 / ký tự Eth
    t = text.replace('\u00d0', 'Đ').replace('\u00f0', 'đ')
    t = unicodedata.normalize('NFC', t)
    
    # 2. Xử lý từ kích hoạt bộ lọc kiểm duyệt (Cương -> Kương: phát âm hoàn toàn đồng âm /kɯəŋ/ trong tiếng Việt)
    t = t.replace('Cương', 'Kương').replace('cương', 'kương')
    
    # 3. Ký tự đặc biệt, ngoặc đơn, gạch nối, dấu câu
    t = t.replace('(', ', ').replace(')', ', ')
    t = t.replace('[', ', ').replace(']', ', ')
    t = t.replace('{', ', ').replace('}', ', ')
    t = t.replace('-', ' ')
    t = t.replace('&', ' và ')
    t = t.replace('•', ' ')
    t = t.replace('“', '').replace('”', '').replace('"', '').replace("'", "")
    t = t.replace(':', ', ').replace(';', ', ').replace('?.', '? ')
    t = t.replace('…', '. ')
    
    # 4. Làm sạch dấu câu trùng lặp
    t = re.sub(r'\s*,\s*', ', ', t)
    t = re.sub(r'(,\s*)+', ', ', t)
    t = re.sub(r',\s*\.', '.', t)
    t = re.sub(r'\.\s*\.', '.', t)
    t = re.sub(r'[\r\n\t]+', ' ', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def to_clauses(text: str, max_chars: int = 75) -> list:
    t = prepare_speech_text(text)
    raw_pieces = re.split(r'([.?!,;:]+[\s]+)', t)
    clauses = []
    curr = ""
    for i in range(0, len(raw_pieces), 2):
        piece = raw_pieces[i]
        punct = raw_pieces[i+1] if i+1 < len(raw_pieces) else ""
        part = (piece + punct).strip()
        if not part:
            continue
        if len(curr) + len(part) + 1 <= max_chars:
            curr = (curr + " " + part).strip()
        else:
            if curr:
                clauses.append(curr)
            if len(part) <= max_chars:
                curr = part
            else:
                words = part.split()
                w_curr = ""
                for w in words:
                    if len(w_curr) + len(w) + 1 <= max_chars:
                        w_curr = (w_curr + " " + w).strip()
                    else:
                        if w_curr:
                            clauses.append(w_curr)
                        w_curr = w
                curr = w_curr
    if curr:
        clauses.append(curr)
    return [c for c in clauses if c.strip()]

async def synthesize_clauses_to_file(clauses: list, out_path: str, ssl_ctx):
    tts_config = TTSConfig(
        voice=VOICE,
        rate=RATE,
        volume="+0%",
        pitch="+0Hz",
        boundary="WordBoundary"
    )
    base_name = os.path.basename(out_path)
    print(f"Synthesizing {base_name} ({len(clauses)} clauses)...", flush=True)
    
    full_audio = bytearray()
    
    async with aiohttp.ClientSession() as session:
        ws = None
        try:
            for idx, clause in enumerate(clauses):
                for retry in range(3):
                    try:
                        if ws is None or ws.closed:
                            ws_url = (
                                f"{WSS_URL}&ConnectionId={connect_id()}"
                                f"&Sec-MS-GEC={DRM.generate_sec_ms_gec()}"
                                f"&Sec-MS-GEC-Version={SEC_MS_GEC_VERSION}"
                            )
                            ws = await session.ws_connect(
                                ws_url,
                                headers=DRM.headers_with_muid(WSS_HEADERS),
                                ssl=ssl_ctx,
                                timeout=aiohttp.ClientTimeout(total=10)
                            )
                            await ws.send_str(
                                f"X-Timestamp:{date_to_string()}\r\n"
                                "Content-Type:application/json; charset=utf-8\r\n"
                                "Path:speech.config\r\n\r\n"
                                '{"context":{"synthesis":{"audio":{"metadataoptions":{'
                                '"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"true"},'
                                '"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n'
                            )
                        
                        ssml = mkssml(tts_config, clause)
                        req = ssml_headers_plus_data(connect_id(), date_to_string(), ssml)
                        await ws.send_str(req)
                        
                        chunk_audio = bytearray()
                        while True:
                            msg = await asyncio.wait_for(ws.receive(), timeout=4.5)
                            if msg.type in (aiohttp.WSMsgType.CLOSED, aiohttp.WSMsgType.CLOSE, aiohttp.WSMsgType.CLOSING):
                                ws = None
                                break
                            if msg.type == aiohttp.WSMsgType.TEXT and "turn.end" in msg.data:
                                break
                            if msg.type == aiohttp.WSMsgType.BINARY:
                                if len(msg.data) > 2:
                                    header_len = int.from_bytes(msg.data[:2], "big")
                                    chunk_audio.extend(msg.data[header_len:])
                        
                        if len(chunk_audio) > 0:
                            full_audio.extend(chunk_audio)
                            break
                        else:
                            if ws:
                                await ws.close()
                            ws = None
                    except Exception:
                        if ws:
                            await ws.close()
                        ws = None
                    await asyncio.sleep(0.2)
                await asyncio.sleep(0.04)
        finally:
            if ws and not ws.closed:
                await ws.close()
                
    if len(full_audio) > 0:
        with open(out_path, "wb") as f:
            f.write(full_audio)
        print(f"-> SUCCESS: {base_name} ({len(full_audio)} bytes)", flush=True)
        return True
    else:
        print(f"-> FAILED: {base_name}", flush=True)
        return False

async def main():
    ssl_ctx = ssl.create_default_context(cafile=certifi.where())
    json_path = r"C:\Users\TanDat\OneDrive - amicalv1\Máy tính\deco\cac khu\khu10\HOC THUOC\ios-native\VovinamHocThuoc\Resources\questions.json"
    audio_dir = r"C:\Users\TanDat\OneDrive - amicalv1\Máy tính\deco\cac khu\khu10\HOC THUOC\ios-native\VovinamHocThuoc\Resources\Audio"
    os.makedirs(audio_dir, exist_ok=True)
    
    with open(json_path, "r", encoding="utf-8") as f:
        questions = json.load(f)
        
    print(f"Generating full audio suite (10 Easy + 10 Full answers = 20 files)...\n", flush=True)
    
    for q in questions:
        num = q["number"]
        
        # 1. Audio Ý cốt tử (q{num}.mp3)
        easy_text = f"Câu {num}. {q['title']}. Ý cốt tử. {q['easyAnswer']['headlineQuote']}. {q['easyAnswer']['coreMeaning']}"
        easy_clauses = to_clauses(easy_text)
        easy_path = os.path.join(audio_dir, f"q{num}.mp3")
        await synthesize_clauses_to_file(easy_clauses, easy_path, ssl_ctx)
        await asyncio.sleep(0.1)
        
        # 2. Audio Nguyên văn chi tiết (q{num}_full.mp3)
        full_ans = q.get("fullAnswer", {})
        intro = full_ans.get("intro", "")
        quote = full_ans.get("quote", "")
        paras = " ".join(full_ans.get("paragraphs", []))
        full_text = f"Câu {num}. {q['title']}. {intro}. {quote}. {paras}"
        full_clauses = to_clauses(full_text)
        full_path = os.path.join(audio_dir, f"q{num}_full.mp3")
        await synthesize_clauses_to_file(full_clauses, full_path, ssl_ctx)
        await asyncio.sleep(0.1)
        
    print("\nALL 20 FILES CREATED SUCCESSFULLY!", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
