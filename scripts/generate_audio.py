import json
import os
from gtts import gTTS

def generate_audio():
    json_path = os.path.join("ios-native", "VovinamHocThuoc", "Resources", "questions.json")
    audio_dir = os.path.join("ios-native", "VovinamHocThuoc", "Resources", "Audio")
    os.makedirs(audio_dir, exist_ok=True)

    with open(json_path, "r", encoding="utf-8") as f:
        questions = json.load(f)

    for q in questions:
        num = q["number"]
        out_file = os.path.join(audio_dir, f"q{num}.mp3")
        
        title = q["title"]
        headline = q.get("easyAnswer", {}).get("headlineQuote", "")
        core = q.get("easyAnswer", {}).get("coreMeaning", "")
        mnemonic = q.get("easyAnswer", {}).get("mnemonic", "")

        headline = headline.replace("“", "").replace("”", "").replace('"', "")
        
        text = f"Câu {num}: {title}. Ý cốt tử bắt buộc thuộc: {headline}. Diễn giải ý nghĩa: {core}. {mnemonic}."
        
        print(f"Generating Vietnamese audio for Question #{num}...")
        tts = gTTS(text=text, lang="vi", slow=False)
        tts.save(out_file)
        print(f"-> Saved: q{num}.mp3 ({os.path.getsize(out_file):,} bytes)")

if __name__ == "__main__":
    generate_audio()
