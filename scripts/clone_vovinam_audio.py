"""
Script tích hợp VieNeu-TTS để nhân bản (clone) giọng đọc cho 10 câu hỏi Vovinam.
Sử dụng mô hình VieNeu-TTS v3 Turbo (48kHz) để clone giọng từ file âm thanh mẫu (3-8 giây).
Kết quả xuất ra thư mục public/audio/ để app phát trực tiếp giọng đã clone!
"""

import os
import sys
import json
import argparse
from pathlib import Path

# Cấu hình danh sách 10 câu hỏi Vovinam cốt lõi
VOVINAM_TEXTS = [
    {
        "id": 1,
        "title": "Ý nghĩa phù hiệu Vovinam Việt Võ Đạo",
        "easy": "Nửa trên hình vuông tượng trưng cho sự ngay thẳng, công bình. Nửa dưới hình tròn tượng trưng cho sự viên dung, chuyển hóa không ngừng. Bốn màu sắc: Xanh hy vọng, Đỏ nhiệt huyết, Vàng danh dự, Trắng tinh khiết.",
        "full": "Phù hiệu Vovinam Việt Võ Đạo có hình nửa trên vuông, nửa dưới tròn. Tượng trưng cho cương nhu phối triển, trời tròn đất vuông. Bốn màu sắc mang ý nghĩa: Màu xanh tượng trưng cho biển cả và niềm hy vọng. Màu đỏ tượng trưng cho máu lửa và tinh thần nhiệt huyết hào hùng. Màu vàng tượng trưng cho màu da danh dự và vinh quang của dân tộc. Màu trắng tượng trưng cho sự trong sạch tinh khiết và đạo hạnh cao quý."
    },
    {
        "id": 2,
        "title": "Ý nghĩa kỳ hiệu (cờ) Vovinam Việt Võ Đạo",
        "easy": "Kỳ hiệu màu vàng mang ý nghĩa vinh quang dân tộc, ở giữa là phù hiệu Vovinam với vòng tròn âm dương cương nhu phối triển.",
        "full": "Kỳ hiệu Vovinam màu vàng viền xanh, chính giữa có phù hiệu môn phái. Thể hiện tinh thần kiên cường, danh dự võ đạo và sự hòa quyện giữa cương và nhu."
    },
    {
        "id": 3,
        "title": "Danh xưng, nguồn gốc và ý nghĩa Vovinam Việt Võ Đạo",
        "easy": "Vovinam do Cố Võ sư Sáng tổ Nguyễn Lộc sáng lập năm 1938 tại Hà Nội trên nền tảng kết hợp tinh hoa võ thuật cổ truyền dân tộc và thế giới.",
        "full": "Danh xưng Vovinam là chữ viết tắt quốc tế của Võ Việt Nam. Do Cố Võ sư Sáng tổ Nguyễn Lộc sáng lập vào mùa thu năm 1938 tại Hà Nội. Môn phái xây dựng trên nguyên lý Cương Nhu Phối Triển, lấy võ thuật dân tộc làm gốc kết hợp tinh hoa võ học thế giới để đào tạo thanh niên Việt Nam cả về thể chất, tâm hồn và ý chí."
    },
    {
        "id": 4,
        "title": "Mục đích của việc học Vovinam Việt Võ Đạo",
        "easy": "Ba mục đích lớn: Bảo tồn và phát huy võ học dân tộc, rèn luyện thân thể và tinh thần võ đạo, phụng sự nhân loại.",
        "full": "Học Vovinam nhằm 3 mục đích chính: Thứ nhất, Bảo tồn và phát huy tinh hoa võ học truyền thống Việt Nam. Thứ hai, Rèn luyện thể lực sung mãn, tinh thần dũng cảm, đức tính khiêm cung và kỷ luật. Thứ ba, Đóng góp xây dựng quê hương đất nước và phục vụ lợi ích của nhân loại theo lý tưởng nhân ái."
    },
    {
        "id": 5,
        "title": "Tôn chỉ của môn phái Vovinam Việt Võ Đạo",
        "easy": "Toàn diện: Sống cho mình, giúp người khác sống và sống vì mọi người.",
        "full": "Tôn chỉ của Vovinam là đào tạo con người toàn diện: Thân thể khỏe mạnh, trí tuệ sáng suốt, tâm hồn cao thượng. Phương châm sống: Sống cho mình, giúp người khác cùng sống, và sẵn sàng hy sinh vì chính nghĩa và dân tộc."
    },
    {
        "id": 6,
        "title": "Nguyên lý Cương Nhu Phối Triển",
        "easy": "Cương nhu phối triển là phối hợp nhịp nhàng giữa cương và nhu, lúc cương lúc nhu, trong cương có nhu, trong nhu có cương.",
        "full": "Nguyên lý Cương Nhu Phối Triển là linh hồn của võ học Vovinam. Không thuần cương để tránh gãy đổ, không thuần nhu để tránh yếu ớt. Linh hoạt biến hóa tùy nghi nghịch cảnh, lấy yếu thắng mạnh, lấy dẻo dai khắc chế cứng rắn."
    },
    {
        "id": 7,
        "title": "10 điều tâm niệm của môn sinh Vovinam",
        "easy": "10 điều kim chỉ nam rèn luyện tư cách võ đạo sinh từ lòng trung kiên, kỷ luật đến tinh thần thượng võ và đạo đức đời thường.",
        "full": "Môn sinh Vovinam nguyện đạt tới đỉnh cao võ thuật để phụng sự nhân loại; kiên trì tu dưỡng đạo đức; đoàn kết tương thân tương ái; tuyệt đối chấp hành kỷ luật môn phái; tôn sư trọng đạo; không tự cao tự đại; sống trong sạch thanh cao; rèn luyện ý chí vượt khó; phán đoán sáng suốt; tự tin, tự thắng và khiêm nhường."
    },
    {
        "id": 8,
        "title": "Ý nghĩa thế chào của môn phái Vovinam",
        "easy": "Bàn tay thép đặt lên trái tim từ ái: Võ lực chỉ phục vụ cho lẽ phải, tình thương và công lý.",
        "full": "Nghi thức chào Vovinam: Bàn tay phải nắm quyền mở (bàn tay thép) đặt trang nghiêm lên ngực trái (trái tim từ ái). Ý nghĩa sâu sắc: Môn sinh Vovinam dùng võ lực kết hợp với lòng nhân ái, sức mạnh thể xác phục vụ lý tưởng nhân bản cao đẹp."
    },
    {
        "id": 9,
        "title": "Hệ thống màu đai và ý nghĩa cấp bậc",
        "easy": "Đai Xanh (nhập môn hy vọng), Đai Vàng (chuyên nghiệp danh dự), Đai Đỏ (tinh hoa nhiệt huyết), Đai Trắng (đạo hạnh viên mãn).",
        "full": "Hệ thống đai Vovinam phản ánh quá trình rèn luyện võ thuật và tu dưỡng tinh thần từ thô sơ đến hoàn thiện: Khởi đầu từ màu Xanh (hy vọng và tiềm năng), tiến tới màu Vàng (màu da, máu thịt danh dự), bước lên màu Đỏ (nhiệt huyết, truyền dạy tinh hoa) và đạt đến màu Trắng (sự trong sạch tột cùng của đạo hạnh võ sư)."
    },
    {
        "id": 10,
        "title": "Lịch sử và cuộc đời Cố Võ sư Sáng tổ Nguyễn Lộc",
        "easy": "Cố Võ sư Nguyễn Lộc sinh năm 1912 tại Sơn Tây, mất năm 1960 tại Sài Gòn. Người đã cống hiến trọn đời để sáng lập và phát triển Vovinam.",
        "full": "Cố Võ sư Sáng tổ Nguyễn Lộc sinh năm Nhâm Tý 1912 tại làng Hữu Bằng, Thạch Thất, Sơn Tây (nay thuộc Hà Nội). Với bầu nhiệt huyết chấn hưng thanh niên trước họa ngoại xâm, thầy đã dày công nghiên cứu cổ truyền võ học, kết hợp tinh hoa thế giới để khai sinh Vovinam năm 1938. Thầy tạ thế năm Canh Tý 1960 tại Sài Gòn, để lại di sản võ đạo trường tồn cho muôn đời sau."
    }
]

def main():
    parser = argparse.ArgumentParser(description="VieNeu-TTS Vovinam Voice Cloning Batch Synthesizer")
    parser.add_argument("--voice-sample", type=str, default="", help="Đường dẫn file audio giọng mẫu 3-8 giây để clone")
    parser.add_argument("--output-dir", type=str, default="public/audio", help="Thư mục xuất file âm thanh")
    parser.add_argument("--speed", type=float, default=0.92, help="Tốc độ đọc (0.8 - 1.2)")
    args = parser.parse_args()

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    print("==================================================")
    print("🦜 VieNeu-TTS Voice Cloning cho Vovinam Hoc Thuoc")
    print("==================================================")
    print(f"Thư mục xuất: {output_dir}")
    if args.voice_sample:
        print(f"File giọng mẫu clone: {args.voice_sample}")
    else:
        print("Không có voice sample, sử dụng giọng mẫu tiếng Việt dựng sẵn của VieNeu-TTS.")

    try:
        from vieneu import Vieneu
        tts = Vieneu(mode="v3turbo")
    except ImportError:
        print("\n[!] Chưa cài đặt thư viện `vieneu`. Hãy chạy:")
        print("    pip install vieneu")
        print("    hoặc dùng: uv sync --extra all trong .agents/skills/vieneu-tts\n")
        return

    manifest = {"cloned_voice": bool(args.voice_sample), "questions": []}

    for item in VOVINAM_TEXTS:
        qid = item["id"]
        title = item["title"]
        print(f"\n[*] Đang sinh giọng đọc Câu {qid}: {title}...")

        easy_file = output_dir / f"q{qid}_easy.mp3"
        full_file = output_dir / f"q{qid}_full.mp3"

        easy_text = f"{title}. {item['easy']}"
        full_text = f"{title}. {item['full']}"

        # Sinh file tóm lược dễ thuộc
        tts.infer(
            text=easy_text,
            prompt_audio=args.voice_sample if args.voice_sample else None,
            output_file=str(easy_file),
            speed=args.speed
        )

        # Sinh file nguyên văn chi tiết
        tts.infer(
            text=full_text,
            prompt_audio=args.voice_sample if args.voice_sample else None,
            output_file=str(full_file),
            speed=args.speed
        )

        manifest["questions"].append({
            "id": qid,
            "title": title,
            "easy_audio": f"/audio/q{qid}_easy.mp3",
            "full_audio": f"/audio/q{qid}_full.mp3"
        })
        print(f"    -> Đã tạo: {easy_file.name} và {full_file.name}")

    with open(output_dir / "manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print("\n[✓] Hoàn tất nhân bản giọng đọc cho toàn bộ 10 câu hỏi!")
    print(f"    Xem danh sách tại: {output_dir / 'manifest.json'}")

if __name__ == "__main__":
    main()
