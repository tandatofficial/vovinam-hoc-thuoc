# 🥋 Vovinam Học Thuộc (Native Swift — iOS 15+)

Ứng dụng ôn luyện và học thuộc 10 câu hỏi lý thuyết võ đạo Vovinam cấp tốc dành cho môn sinh chuẩn bị thi thăng đai (Lam đai I, II, III). 
Được xây dựng **100% Native Swift & SwiftUI**, tối ưu hóa hoàn toàn cho iOS 15 - 18, không sử dụng WebKit/Capacitor để đảm bảo hiệu năng tối đa và tính ổn định tuyệt đối.

---

## 🌟 Điểm Nổi Bật Sau Khi Refactoring

1. **Kiến Trúc Chuẩn MVVM & Clean Architecture**:
   - `DesignSystem/`: Định nghĩa tập trung màu sắc thương hiệu (`AppTheme.Colors`), bo góc, bóng đổ và hiệu ứng phản hồi nút bấm (`TactileButtonStyle`).
   - `Components/`: Tái sử dụng tối đa các thành phần UI dùng chung (`ScoreBadgeView`, `SpeechPlayerBar`, `QuestionRowView`).
   - `Services/`: Phân tách độc lập tầng lưu trữ dữ liệu (`DataManagerProtocol`) và âm thanh (`SpeechServiceProtocol`).
   - `ViewModels/`: Quản lý trạng thái học tập tập trung, tính toán tiến độ, streak và đồng bộ phản hồi tức thì.
2. **Dữ Liệu Động (Hết Hardcode)**:
   - Dữ liệu 10 câu hỏi được lưu trữ dạng tệp JSON tại `Documents/vovinam_questions_v1.json`.
   - Hỗ trợ tính năng **Xuất / Nhập / Tùy biến JSON** trực tiếp trong màn hình Cài đặt, có kiểm tra tính hợp lệ dữ liệu (Validation).
3. **Giọng Đọc Native Tiếng Việt Offline (Apple vi-VN)**:
   - Tích hợp `AVSpeechSynthesizer` với voice tiếng Việt, hỗ trợ điều chỉnh tốc độ (0.8x / 1.0x).
   - Tự động ngắt phát âm khi có gián đoạn (cuộc gọi đến, Siri).
4. **4 Chế Độ Học Chuyên Sâu**:
   - **Tổng quan**: 3 tầng ghi nhớ (Tầng 1: Câu hỏi & Loa phát âm; Tầng 2: Gợi ý từ khóa; Tầng 3: Dễ học & Ý cốt tử / Chi tiết nguyên văn).
   - **Học từng đoạn (Chunks)**: Chia nhỏ câu trả lời dài thành các phân đoạn 15-25 từ, có tính năng che chữ tự nhẩm.
   - **Điền từ khuyết (Cloze)**: Trắc nghiệm điền từ khóa quan trọng vào chỗ trống.
   - **Checklist ý**: Điểm danh từng ý bắt buộc phải trình bày trong kỳ thi.
5. **Phòng Thi Vấn Đáp (Exam)**:
   - Bốc thăm ngẫu nhiên 5 hoặc 10 câu hỏi, tự lật đáp án đối chiếu và chấm điểm phản xạ thực tế.
6. **Sửa Triệt Để Nút Đặt Lại**:
   - Nút đặt lại toàn bộ tiến độ trong Trang chủ và Cài đặt hoạt động reactive ngay lập tức, đưa mọi câu về 0 điểm và làm mới ngày học.

---

## 📁 Cấu Trúc Dự Án (Architecture Tree)

```text
ios-native/
├── project.yml                       # Cấu hình dự án cho XcodeGen
└── VovinamHocThuoc/
    ├── DesignSystem/
    │   └── AppTheme.swift            # Theme màu sắc, kiểu đổ bóng, ButtonStyle
    ├── Components/
    │   ├── ScoreBadgeView.swift      # Huy hiệu điểm (Chưa thuộc / Mang máng / Thuộc làu)
    │   ├── SpeechPlayerBar.swift     # Thanh điều khiển phát âm tiếng Việt
    │   └── QuestionRowView.swift     # Hàng hiển thị câu hỏi danh sách tái sử dụng
    ├── Models/
    │   └── Question.swift            # Model dữ liệu Codable (Question, Cloze, EasyAnswer...)
    ├── Services/
    │   ├── DataManager.swift         # Quản lý lưu trữ tệp Documents & Import/Export JSON
    │   └── SpeechService.swift       # Dịch vụ đọc âm thanh native AVSpeechSynthesizer
    ├── ViewModels/
    │   └── StudyViewModel.swift      # Quản lý state toàn bộ ứng dụng
    ├── Views/
    │   ├── HomeView.swift            # Màn hình Trang chủ (Lộ trình 10 ngày, thống kê)
    │   ├── StudyView.swift           # Màn hình Học bài (3 tầng ghi nhớ)
    │   ├── ChunkStudyView.swift      # Chế độ học từng phân đoạn
    │   ├── FillBlanksView.swift      # Chế độ điền từ khuyết
    │   ├── KeyPointsChecklistView.swift # Chế độ checklist ý bắt buộc
    │   ├── QuestionsListView.swift   # Ngân hàng 10 câu hỏi kèm tìm kiếm & lọc
    │   ├── ExamView.swift            # Phòng thi thử vấn đáp bốc thăm
    │   ├── MistakeNotebookView.swift # Sổ tay câu sai (0đ) và câu đánh dấu sao
    │   ├── SettingsView.swift        # Cài đặt ngày, xuất/nhập JSON, đặt lại tiến độ
    │   └── MainTabView.swift         # TabBar 5 mục điều hướng
    ├── Resources/
    │   ├── questions.json            # 10 câu lý thuyết mẫu chuẩn Vovinam
    │   └── day_plan.json             # Lộ trình học 10 ngày
    ├── Info.plist                    # Bundle cấu hình iOS
    └── VovinamHocThuocApp.swift      # App Entry Point (@main)
```

---

## 📲 Cài Đặt File `.ipa` (TrollStore trên iPhone)

1. Mở Safari trên iPhone truy cập vào [**Releases v2.0-native-swift**](https://github.com/tandatofficial/vovinam-hoc-thuoc/releases/tag/v2.0-native-swift).
2. Tải về file `VovinamHocThuoc.ipa`.
3. Mở file trong mục Tải về -> chọn **Chia sẻ** -> chọn **TrollStore**.
4. Ứng dụng sẽ được cài đặt trực tiếp, vĩnh viễn và không bao giờ bị thu hồi chứng chỉ (Revoke).

---

## 🛠️ Biên Dịch Bằng XcodeGen Trên Máy Cá Nhân

Nếu bạn muốn chỉnh sửa mã nguồn trực tiếp trên máy macOS:

```bash
cd ios-native
xcodegen generate
open VovinamHocThuoc.xcodeproj
```
Biên dịch và chạy trực tiếp trên iPhone hoặc iOS Simulator 15.0+.
