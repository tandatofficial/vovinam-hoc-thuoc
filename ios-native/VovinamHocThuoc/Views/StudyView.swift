import SwiftUI

public struct StudyView: View {
    @ObservedObject var viewModel: StudyViewModel
    @StateObject private var speechService = SpeechService.shared

    @State private var fontSizeLevel: Int = 1 // 0: Nhỏ, 1: Chuẩn, 2: To

    private var currentTextSize: CGFloat {
        switch fontSizeLevel {
        case 0: return 15
        case 2: return 19
        default: return 17
        }
    }

    public var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // MARK: - 1. Thanh chọn câu hỏi ngang [#1] -> [#10]
                questionSelectorBar

                ScrollView {
                    VStack(spacing: 16) {
                        // MARK: - 2. Thanh chuyển Sub-Modes (Tổng quan / Từng đoạn / Điền từ / Checklist)
                        subModePicker

                        if viewModel.selectedSubMode == .chunk {
                            ChunkStudyView(question: viewModel.currentQuestion)
                        } else if viewModel.selectedSubMode == .cloze {
                            FillBlanksView(question: viewModel.currentQuestion)
                        } else if viewModel.selectedSubMode == .checklist {
                            KeyPointsChecklistView(question: viewModel.currentQuestion)
                        } else {
                            // MARK: - 3. Chế độ Tổng quan 3 Tầng Ghi Nhớ
                            overviewStudyContent(question: viewModel.currentQuestion)
                        }

                        // MARK: - 4. Thumb-Zone Self Assessment (3 Nút to bản)
                        selfAssessmentBar(question: viewModel.currentQuestion)
                    }
                    .padding(.bottom, 24)
                }
            }
            .navigationTitle("Luyện Thuộc Lòng")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: {
                        fontSizeLevel = (fontSizeLevel + 1) % 3
                    }) {
                        HStack(spacing: 2) {
                            Text("Aa")
                                .font(.system(size: 15, weight: .bold))
                        }
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(.systemGray6))
                        .cornerRadius(8)
                    }
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        viewModel.toggleBookmark(questionId: viewModel.currentQuestion.id)
                    }) {
                        Image(systemName: viewModel.currentQuestion.isMarkedFavorite ? "star.fill" : "star")
                            .foregroundColor(viewModel.currentQuestion.isMarkedFavorite ? .yellow : .primary)
                    }
                }
            }
        }
    }

    // MARK: - Question Selector Bar
    private var questionSelectorBar: some View {
        ScrollViewReader { proxy in
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(viewModel.questions) { q in
                        let isSelected = q.id == viewModel.selectedQuestionId

                        Button(action: {
                            viewModel.selectQuestion(id: q.id)
                        }) {
                            VStack(spacing: 2) {
                                Text("#\(q.number)")
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(isSelected ? .white : .primary)

                                // Score dot
                                Circle()
                                    .fill(scoreColor(q.score))
                                    .frame(width: 6, height: 6)
                            }
                            .frame(width: 44, height: 42)
                            .background(isSelected ? Color.blue : Color(.systemGray6))
                            .cornerRadius(12)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(isSelected ? Color.blue : Color.clear, lineWidth: 1.5)
                            )
                        }
                        .id(q.id)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
            }
            .background(Color(.systemBackground))
            .onChange(of: viewModel.selectedQuestionId) { newId in
                withAnimation {
                    proxy.scrollTo(newId, anchor: .center)
                }
            }
        }
    }

    // MARK: - Sub-Mode Picker
    private var subModePicker: some View {
        HStack(spacing: 6) {
            ForEach(StudySubMode.allCases) { mode in
                let isSelected = viewModel.selectedSubMode == mode

                Button(action: {
                    viewModel.selectedSubMode = mode
                    speechService.stop()
                }) {
                    HStack(spacing: 4) {
                        Image(systemName: mode.iconName)
                            .font(.system(size: 12))
                        Text(mode.rawValue)
                            .font(.system(size: 12, weight: .bold))
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 7)
                    .background(isSelected ? Color.blue : Color(.systemGray6))
                    .foregroundColor(isSelected ? .white : .secondary)
                    .cornerRadius(10)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.top, 4)
    }

    // MARK: - Overview Content (3 Tầng)
    private func overviewStudyContent(question: Question) -> some View {
        VStack(spacing: 14) {
            // TẦNG 1: CÂU HỎI & THANH AUDIO
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Text("CÂU HỎI #\(question.number)")
                        .font(.caption2.weight(.black))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(Color.blue.opacity(0.12))
                        .foregroundColor(.blue)
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
                VStack(spacing: 10) {
                    HStack {
                        HStack(spacing: 8) {
                            Image(systemName: speechService.isSpeaking ? "waveform" : "speaker.wave.2.fill")
                                .font(.system(size: 16))
                                .foregroundColor(speechService.isSpeaking ? .red : .blue)

                            Text(speechService.isSpeaking ? "Đang đọc mẫu..." : "Giọng đọc Tiếng Việt (Apple vi-VN)")
                                .font(.caption.weight(.bold))
                                .foregroundColor(.primary)
                        }

                        Spacer()

                        // Nút chỉnh tốc độ đọc
                        HStack(spacing: 4) {
                            Button(action: { speechService.setSpeedSlow() }) {
                                Text("0.8x")
                                    .font(.system(size: 11, weight: .bold))
                                    .padding(.horizontal, 7)
                                    .padding(.vertical, 3)
                                    .background(speechService.speechRate < 0.48 ? Color.blue : Color(.systemGray5))
                                    .foregroundColor(speechService.speechRate < 0.48 ? .white : .secondary)
                                    .cornerRadius(6)
                            }

                            Button(action: { speechService.setSpeedNormal() }) {
                                Text("1.0x")
                                    .font(.system(size: 11, weight: .bold))
                                    .padding(.horizontal, 7)
                                    .padding(.vertical, 3)
                                    .background(speechService.speechRate >= 0.48 ? Color.blue : Color(.systemGray5))
                                    .foregroundColor(speechService.speechRate >= 0.48 ? .white : .secondary)
                                    .cornerRadius(6)
                            }
                        }
                    }

                    HStack(spacing: 10) {
                        Button(action: {
                            let text = "\(question.title). Ý chính: \(question.easyAnswer.headlineQuote). \(question.easyAnswer.coreMeaning)"
                            speechService.toggle(text)
                        }) {
                            HStack {
                                Image(systemName: speechService.isSpeaking ? "stop.fill" : "play.fill")
                                Text(speechService.isSpeaking ? "Dừng đọc" : "Đọc câu hỏi & ý chính")
                            }
                            .font(.system(size: 13, weight: .bold))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 9)
                            .background(speechService.isSpeaking ? Color.red : Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(10)
                        }

                        Button(action: {
                            speechService.speak(question.title)
                        }) {
                            Text("Chỉ câu hỏi")
                                .font(.system(size: 12, weight: .bold))
                                .padding(.horizontal, 12)
                                .padding(.vertical, 9)
                                .background(Color(.systemGray6))
                                .foregroundColor(.primary)
                                .cornerRadius(10)
                        }
                    }
                }
                .padding(12)
                .background(Color.blue.opacity(0.06))
                .cornerRadius(12)
            }
            .padding()
            .background(Color(.systemBackground))
            .cornerRadius(16)
            .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 3)
            .padding(.horizontal, 16)

            // TẦNG 2: GỢI NHỚ TỪ KHÓA
            VStack(alignment: .leading, spacing: 8) {
                Button(action: {
                    withAnimation { viewModel.isHintExpanded.toggle() }
                }) {
                    HStack {
                        Label("Gợi ý từ khóa tốc hành", systemImage: "sparkles")
                            .font(.caption.weight(.bold))
                            .foregroundColor(.orange)

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
            .background(Color.orange.opacity(0.08))
            .cornerRadius(14)
            .padding(.horizontal, 16)

            // TẦNG 3: ĐÁP ÁN (DỄ HỌC / NGUYÊN VĂN)
            VStack(alignment: .leading, spacing: 12) {
                // Tabs chuyển Dễ học vs Nguyên văn
                Picker("", selection: $viewModel.currentAnswerTab) {
                    Text("Dễ học & Mẹo nhớ").tag(AnswerTabType.easy)
                    Text("Nguyên văn chi tiết").tag(AnswerTabType.full)
                }
                .pickerStyle(.segmented)

                if viewModel.currentAnswerTab == .easy {
                    // TAB 1: DỄ HỌC
                    VStack(alignment: .leading, spacing: 12) {
                        // Ý cốt tử
                        VStack(alignment: .leading, spacing: 6) {
                            Label("Ý cốt tử bắt buộc thuộc", systemImage: "bookmark.fill")
                                .font(.caption2.weight(.bold))
                                .foregroundColor(.orange)

                            Text(question.easyAnswer.headlineQuote)
                                .font(.system(size: currentTextSize, weight: .bold, design: .rounded))
                                .foregroundColor(.primary)
                                .lineSpacing(4)
                        }
                        .padding()
                        .background(Color.yellow.opacity(0.12))
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.orange.opacity(0.3), lineWidth: 1)
                        )

                        // Mẹo nhớ
                        HStack(alignment: .top, spacing: 10) {
                            Image(systemName: "lightbulb.fill")
                                .foregroundColor(.blue)
                                .padding(.top, 2)

                            VStack(alignment: .leading, spacing: 2) {
                                Text("Mẹo nhớ nhanh:")
                                    .font(.caption2.weight(.bold))
                                    .foregroundColor(.blue)

                                Text(question.easyAnswer.mnemonic)
                                    .font(.system(size: currentTextSize - 1, weight: .medium))
                                    .foregroundColor(.primary)
                            }
                        }
                        .padding()
                        .background(Color.blue.opacity(0.06))
                        .cornerRadius(12)

                        // Diễn giải ý nghĩa
                        Text(question.easyAnswer.coreMeaning)
                            .font(.system(size: currentTextSize, design: .rounded))
                            .lineSpacing(5)
                            .padding(.top, 2)
                    }
                } else {
                    // TAB 2: NGUYÊN VĂN CHI TIẾT
                    VStack(alignment: .leading, spacing: 12) {
                        // Nút nghe toàn văn
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
                            .background(speechService.isSpeaking ? Color.red : Color.blue.opacity(0.12))
                            .foregroundColor(speechService.isSpeaking ? .white : .blue)
                            .cornerRadius(10)
                        }

                        Text(question.fullAnswer.intro)
                            .font(.system(size: currentTextSize, weight: .bold))
                            .foregroundColor(.blue)

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
                                        .foregroundColor(.blue),
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
            .background(Color(.systemBackground))
            .cornerRadius(16)
            .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 3)
            .padding(.horizontal, 16)
        }
    }

    // MARK: - Self Assessment Bar (3 Big Tactile Buttons)
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
                        Text("Quên")
                            .font(.system(size: 15, weight: .bold))
                        Text("+0đ")
                            .font(.caption2)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(question.score == 0 ? Color.red : Color.red.opacity(0.12))
                    .foregroundColor(question.score == 0 ? .white : .red)
                    .cornerRadius(14)
                }

                // 2. Nhớ mang máng (1đ)
                Button(action: {
                    viewModel.updateScore(questionId: question.id, score: 1)
                    viewModel.nextQuestion()
                }) {
                    VStack(spacing: 3) {
                        Text("Mang máng")
                            .font(.system(size: 15, weight: .bold))
                        Text("+1đ")
                            .font(.caption2)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(question.score == 1 ? Color.orange : Color.orange.opacity(0.12))
                    .foregroundColor(question.score == 1 ? .white : .orange)
                    .cornerRadius(14)
                }

                // 3. Thuộc làu (2đ)
                Button(action: {
                    viewModel.updateScore(questionId: question.id, score: 2)
                    viewModel.nextQuestion()
                }) {
                    VStack(spacing: 3) {
                        Text("Thuộc làu")
                            .font(.system(size: 15, weight: .bold))
                        Text("+2đ")
                            .font(.caption2)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(question.score == 2 ? Color.green : Color.green.opacity(0.12))
                    .foregroundColor(question.score == 2 ? .white : .green)
                    .cornerRadius(14)
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(18)
        .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 3)
        .padding(.horizontal, 16)
    }

    private func scoreColor(_ score: Int) -> Color {
        switch score {
        case 2: return .green
        case 1: return .orange
        default: return .red
        }
    }
}
