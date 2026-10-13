import SwiftUI

public struct StudyView: View {
    @ObservedObject public var viewModel: StudyViewModel
    @StateObject private var speechService = SpeechService.shared

    @State private var currentTextSize: CGFloat = 16

    public init(viewModel: StudyViewModel) {
        self.viewModel = viewModel
    }

    public var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // MARK: - Thanh Lựa Chọn Câu Hỏi Ngang (#1 đến #10 To Bản)
                questionNumberSelector

                // MARK: - 4 Chế Độ Học Chuyên Sâu (Segmented Mode Picker)
                subModePicker

                // MARK: - Nội Dung Chế Độ Học
                ScrollView {
                    let question = viewModel.currentQuestion

                    VStack(spacing: 16) {
                        switch viewModel.selectedSubMode {
                        case .overview:
                            overviewStudyContent(question: question)
                        case .chunk:
                            ChunkStudyView(question: question)
                        case .cloze:
                            FillBlanksView(question: question)
                        case .checklist:
                            KeyPointsChecklistView(question: question)
                        }

                        // MARK: - Thanh 3 Nút Tự Chấm Điểm To Bản (Chỉ hiện ở Overview)
                        if viewModel.selectedSubMode == .overview {
                            selfAssessmentBar(question: question)
                        }
                    }
                    .padding(.vertical, 12)
                }
            }
            .navigationTitle("Học Bài Võ Đạo")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItemGroup(placement: .navigationBarTrailing) {
                    // Chỉnh cỡ chữ A- / A+
                    HStack(spacing: 2) {
                        Button(action: {
                            if currentTextSize > 14 { currentTextSize -= 1 }
                        }) {
                            Text("A-")
                                .font(.footnote.weight(.bold))
                        }

                        Button(action: {
                            if currentTextSize < 22 { currentTextSize += 1 }
                        }) {
                            Text("A+")
                                .font(.footnote.weight(.bold))
                        }
                    }

                    // Nút Đánh dấu sao / Ghim ôn lại
                    Button(action: {
                        viewModel.toggleBookmark(questionId: viewModel.selectedQuestionId)
                    }) {
                        Image(systemName: (viewModel.currentQuestion.isBookmarked ?? false) ? "star.fill" : "star")
                            .foregroundColor(AppTheme.Colors.gold)
                    }
                }
            }
        }
    }

    // MARK: - 1. Question Number Selector (Thanh chọn câu ngang #1 - #10)
    private var questionNumberSelector: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(viewModel.questions) { q in
                    let isSelected = q.id == viewModel.selectedQuestionId
                    Button(action: {
                        viewModel.selectQuestion(id: q.id)
                    }) {
                        VStack(spacing: 2) {
                            Text("#\(q.number)")
                                .font(.subheadline.weight(.bold))
                                .foregroundColor(isSelected ? .white : .primary)

                            // Dấu chấm màu biểu thị điểm số đã đạt
                            ScoreBadgeView(score: q.score, style: .compact)
                        }
                        .frame(width: 48, height: 48)
                        .background(isSelected ? AppTheme.Colors.primary : Color(.systemGray6))
                        .cornerRadius(AppTheme.CornerRadius.medium)
                    }
                    .buttonStyle(TactileButtonStyle())
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 8)
        }
        .background(Color(.systemBackground))
        .overlay(
            Divider(), alignment: .bottom
        )
    }

    // MARK: - 2. SubMode Picker
    private var subModePicker: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(StudySubMode.allCases) { mode in
                    let isSelected = viewModel.selectedSubMode == mode
                    Button(action: {
                        speechService.stop()
                        withAnimation { viewModel.selectedSubMode = mode }
                    }) {
                        HStack(spacing: 6) {
                            Image(systemName: mode.iconName)
                            Text(mode.rawValue)
                        }
                        .font(.footnote.weight(isSelected ? .bold : .medium))
                        .padding(.horizontal, 12)
                        .padding(.vertical, 7)
                        .background(isSelected ? AppTheme.Colors.primary : Color(.systemGray6))
                        .foregroundColor(isSelected ? .white : .primary)
                        .cornerRadius(AppTheme.CornerRadius.small)
                    }
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 6)
        }
        .background(Color(.systemBackground))
        .overlay(
            Divider(), alignment: .bottom
        )
    }

    // MARK: - 3. Overview Study Content (3 Tầng Ghi Nhớ)
    private func overviewStudyContent(question: Question) -> some View {
        VStack(spacing: 16) {
            // TẦNG 1: CÂU HỎI & THANH AUDIO NATIVE
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Text("CÂU HỎI #\(question.number)")
                        .font(.caption2.weight(.black))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(AppTheme.Colors.primaryLight)
                        .foregroundColor(AppTheme.Colors.primary)
                        .cornerRadius(6)

                    Spacer()

                    Text(question.category)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Text(question.title)
                    .font(.system(size: currentTextSize + 3, weight: .bold, design: .rounded))
                    .foregroundColor(.primary)
                    .lineSpacing(4)

                // Thanh Giọng Đọc Native Tiếng Việt
                SpeechPlayerBar(
                    questionNumber: question.number,
                    textToSpeak: "\(question.title). Ý cốt tử: \(question.easyAnswer.headlineQuote). \(question.easyAnswer.coreMeaning)",
                    labelText: "Giọng đọc Tiếng Việt (Người thật 100%)"
                )
            }
            .padding()
            .appCardStyle()
            .padding(.horizontal, 16)

            // TẦNG 2: GỢI NHỚ TỪ KHÓA TỐC HÀNH
            VStack(alignment: .leading, spacing: 8) {
                Button(action: {
                    withAnimation { viewModel.isHintExpanded.toggle() }
                }) {
                    HStack {
                        Label("Gợi ý từ khóa tốc hành", systemImage: "sparkles")
                            .font(.caption.weight(.bold))
                            .foregroundColor(AppTheme.Colors.learning)

                        Spacer()

                        Image(systemName: viewModel.isHintExpanded ? "chevron.up" : "chevron.down")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }

                if viewModel.isHintExpanded {
                    Text(question.hintWords)
                        .font(.system(size: currentTextSize - 1, weight: .semibold))
                        .foregroundColor(.primary)
                        .padding(.top, 4)
                }
            }
            .padding()
            .background(AppTheme.Colors.learningBg)
            .cornerRadius(AppTheme.CornerRadius.medium)
            .padding(.horizontal, 16)

            // TẦNG 3: ĐÁP ÁN (DỄ HỌC / NGUYÊN VĂN)
            VStack(alignment: .leading, spacing: 12) {
                Picker("", selection: $viewModel.currentAnswerTab) {
                    Text("Dễ học & Mẹo nhớ").tag(AnswerTabType.easy)
                    Text("Nguyên văn chi tiết").tag(AnswerTabType.full)
                }
                .pickerStyle(.segmented)

                if viewModel.currentAnswerTab == .easy {
                    // TAB 1: DỄ HỌC & Ý CỐT TỬ
                    VStack(alignment: .leading, spacing: 12) {
                        VStack(alignment: .leading, spacing: 6) {
                            Label("Ý cốt tử bắt buộc thuộc", systemImage: "bookmark.fill")
                                .font(.caption2.weight(.bold))
                                .foregroundColor(AppTheme.Colors.learning)

                            Text(question.easyAnswer.headlineQuote)
                                .font(.system(size: currentTextSize, weight: .bold, design: .rounded))
                                .foregroundColor(.primary)
                                .lineSpacing(4)
                        }
                        .padding()
                        .background(AppTheme.Colors.gold.opacity(0.12))
                        .cornerRadius(AppTheme.CornerRadius.medium)
                        .overlay(
                            RoundedRectangle(cornerRadius: AppTheme.CornerRadius.medium)
                                .stroke(AppTheme.Colors.learning.opacity(0.3), lineWidth: 1)
                        )

                        // Mẹo nhớ
                        HStack(alignment: .top, spacing: 10) {
                            Image(systemName: "lightbulb.fill")
                                .foregroundColor(AppTheme.Colors.primary)
                                .padding(.top, 2)

                            VStack(alignment: .leading, spacing: 2) {
                                Text("Mẹo nhớ nhanh:")
                                    .font(.caption2.weight(.bold))
                                    .foregroundColor(AppTheme.Colors.primary)

                                Text(question.easyAnswer.mnemonic)
                                    .font(.system(size: currentTextSize - 1, weight: .medium))
                                    .foregroundColor(.primary)
                            }
                        }
                        .padding()
                        .background(AppTheme.Colors.primaryLight)
                        .cornerRadius(AppTheme.CornerRadius.medium)

                        // Diễn giải ý nghĩa
                        Text(question.easyAnswer.coreMeaning)
                            .font(.system(size: currentTextSize, design: .rounded))
                            .lineSpacing(5)
                            .padding(.top, 2)
                    }
                } else {
                    // TAB 2: NGUYÊN VĂN CHI TIẾT
                    VStack(alignment: .leading, spacing: 12) {
                        Button(action: {
                            let full = "\(question.fullAnswer.intro). \(question.fullAnswer.quote ?? ""). " + question.fullAnswer.paragraphs.joined(separator: ". ")
                            speechService.toggle(full)
                        }) {
                            HStack {
                                Image(systemName: speechService.isSpeaking ? "stop.fill" : "speaker.wave.3.fill")
                                Text(speechService.isSpeaking ? "Dừng đọc" : "Nghe đọc toàn bộ nguyên văn")
                            }
                            .font(.caption.weight(.bold))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 8)
                            .background(speechService.isSpeaking ? AppTheme.Colors.unlearned : AppTheme.Colors.primaryLight)
                            .foregroundColor(speechService.isSpeaking ? .white : AppTheme.Colors.primary)
                            .cornerRadius(10)
                        }

                        Text(question.fullAnswer.intro)
                            .font(.system(size: currentTextSize, weight: .bold))
                            .foregroundColor(AppTheme.Colors.primary)

                        if let quote = question.fullAnswer.quote, !quote.isEmpty {
                            Text(quote)
                                .font(.system(size: currentTextSize, weight: .semibold))
                                .italic()
                                .padding()
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color(.systemGray6))
                                .cornerRadius(10)
                                .overlay(
                                    Rectangle()
                                        .frame(width: 4)
                                        .foregroundColor(AppTheme.Colors.primary),
                                    alignment: .leading
                                )
                        }

                        ForEach(question.fullAnswer.paragraphs, id: \.self) { p in
                            Text(p)
                                .font(.system(size: currentTextSize, design: .rounded))
                                .lineSpacing(5)
                                .padding()
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color(.systemGray6).opacity(0.6))
                                .cornerRadius(12)
                        }
                    }
                }
            }
            .padding()
            .appCardStyle()
            .padding(.horizontal, 16)
        }
    }

    // MARK: - 4. Self Assessment Bar (3 Big Tactile Buttons)
    private func selfAssessmentBar(question: Question) -> some View {
        VStack(spacing: 8) {
            Text("TỰ ĐÁNH GIÁ PHẢN XẠ NHỚ")
                .font(.caption2.weight(.bold))
                .foregroundColor(.secondary)
                .tracking(1)

            HStack(spacing: 10) {
                // 1. Quên (0đ)
                Button(action: {
                    viewModel.updateScore(questionId: question.id, score: 0)
                    viewModel.nextQuestion()
                }) {
                    VStack(spacing: 3) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 22))
                        Text("Quên (0đ)")
                            .font(.subheadline.weight(.bold))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(AppTheme.Colors.unlearnedBg)
                    .foregroundColor(AppTheme.Colors.unlearned)
                    .cornerRadius(AppTheme.CornerRadius.medium)
                }
                .buttonStyle(TactileButtonStyle())

                // 2. Mang máng (1đ)
                Button(action: {
                    viewModel.updateScore(questionId: question.id, score: 1)
                    viewModel.nextQuestion()
                }) {
                    VStack(spacing: 3) {
                        Image(systemName: "questionmark.circle.fill")
                            .font(.system(size: 22))
                        Text("Mang máng (1đ)")
                            .font(.subheadline.weight(.bold))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(AppTheme.Colors.learningBg)
                    .foregroundColor(AppTheme.Colors.learning)
                    .cornerRadius(AppTheme.CornerRadius.medium)
                }
                .buttonStyle(TactileButtonStyle())

                // 3. Thuộc làu (2đ)
                Button(action: {
                    viewModel.updateScore(questionId: question.id, score: 2)
                    viewModel.nextQuestion()
                }) {
                    VStack(spacing: 3) {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 22))
                        Text("Thuộc làu (2đ)")
                            .font(.subheadline.weight(.bold))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(AppTheme.Colors.masteredBg)
                    .foregroundColor(AppTheme.Colors.mastered)
                    .cornerRadius(AppTheme.CornerRadius.medium)
                }
                .buttonStyle(TactileButtonStyle())
            }
        }
        .padding()
        .appCardStyle()
        .padding(.horizontal, 16)
    }
}
