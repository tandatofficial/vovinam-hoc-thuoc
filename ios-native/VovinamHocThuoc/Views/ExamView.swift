import SwiftUI

public struct ExamView: View {
    @ObservedObject public var viewModel: StudyViewModel

    @State private var examQuestions: [Question] = []
    @State private var currentExamIndex: Int = 0
    @State private var isAnswerRevealed: Bool = false
    @State private var isExamFinished: Bool = false
    @State private var examScores: [Int: Int] = [:] // index -> score

    public init(viewModel: StudyViewModel) {
        self.viewModel = viewModel
    }

    private var maxExamPoints: Int {
        max(1, examQuestions.count * 2)
    }

    private var examPercent: Int {
        Int(Double(totalCurrentExamScore) / Double(maxExamPoints) * 100)
    }

    private var isExamPassed: Bool {
        examPercent >= 70
    }

    public var body: some View {
        NavigationView {
            VStack {
                if isExamFinished {
                    examResultView
                } else if examQuestions.isEmpty {
                    examStartView
                } else {
                    examActiveView
                }
            }
            .navigationTitle("Thi Thử Vấn Đáp")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    // MARK: - 1. Start View
    private var examStartView: some View {
        VStack(spacing: 20) {
            Image(systemName: "graduationcap.circle.fill")
                .font(.system(size: 72))
                .foregroundColor(AppTheme.Colors.primary)

            Text("Phòng Thi Thử Vấn Đáp")
                .font(.title2.weight(.bold))

            Text("Hệ thống sẽ bốc ngẫu nhiên câu hỏi trong ngân hàng 10 câu lý thuyết để bạn tự kiểm tra phản xạ vấn đáp như trong kỳ thi thăng đai thực tế.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)

            VStack(spacing: 12) {
                Button(action: { startExam(questionCount: 5) }) {
                    Text("Thi nhanh (5 câu ngẫu nhiên)")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(AppTheme.Colors.primary)
                        .foregroundColor(.white)
                        .cornerRadius(AppTheme.CornerRadius.medium)
                }
                .buttonStyle(TactileButtonStyle())

                Button(action: { startExam(questionCount: 10) }) {
                    Text("Thi toàn diện (Trọn bộ 10 câu)")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color(.systemGray6))
                        .foregroundColor(.primary)
                        .cornerRadius(AppTheme.CornerRadius.medium)
                }
                .buttonStyle(TactileButtonStyle())
            }
            .padding(.horizontal, 24)
            .padding(.top, 16)
        }
        .padding()
    }

    // MARK: - 2. Active Exam View
    private var examActiveView: some View {
        ScrollView {
            if currentExamIndex < examQuestions.count {
                let q = examQuestions[currentExamIndex]

                VStack(spacing: 16) {
                    // Header tiến độ bài thi
                    HStack {
                        Text("Câu \(currentExamIndex + 1)/\(examQuestions.count)")
                            .font(.subheadline.weight(.bold))
                            .foregroundColor(AppTheme.Colors.primary)

                        Spacer()

                        Text("Điểm tạm tính: \(totalCurrentExamScore)đ")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding(.horizontal)

                    // Thẻ câu hỏi
                    VStack(alignment: .leading, spacing: 12) {
                        Text("CÂU HỎI VẤN ĐÁP")
                            .font(.caption2.weight(.black))
                            .foregroundColor(AppTheme.Colors.primary)

                        Text(q.title)
                            .font(.title3.weight(.bold))
                            .foregroundColor(.primary)
                    }
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .appCardStyle()
                    .padding(.horizontal)

                    // Lật xem đáp án
                    if isAnswerRevealed {
                        VStack(alignment: .leading, spacing: 12) {
                            Label("Đáp án mẫu chuẩn", systemImage: "checkmark.seal.fill")
                                .font(.caption.weight(.bold))
                                .foregroundColor(AppTheme.Colors.mastered)

                            Text(q.easyAnswer.headlineQuote)
                                .font(.headline.weight(.bold))
                                .foregroundColor(.primary)

                            Text(q.easyAnswer.coreMeaning)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(AppTheme.Colors.masteredBg)
                        .cornerRadius(AppTheme.CornerRadius.large)
                        .padding(.horizontal)

                        // Nút tự chấm điểm
                        VStack(spacing: 8) {
                            Text("TỰ CHẤM ĐIỂM CÂU NÀY")
                                .font(.caption2.weight(.bold))
                                .foregroundColor(.secondary)

                            HStack(spacing: 10) {
                                Button(action: { recordExamScore(0) }) {
                                    Text("Chưa đạt (0đ)")
                                        .font(.footnote.weight(.bold))
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .background(AppTheme.Colors.unlearnedBg)
                                        .foregroundColor(AppTheme.Colors.unlearned)
                                        .cornerRadius(AppTheme.CornerRadius.medium)
                                }
                                .buttonStyle(TactileButtonStyle())

                                Button(action: { recordExamScore(1) }) {
                                    Text("Đạt 50% (1đ)")
                                        .font(.footnote.weight(.bold))
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .background(AppTheme.Colors.learningBg)
                                        .foregroundColor(AppTheme.Colors.learning)
                                        .cornerRadius(AppTheme.CornerRadius.medium)
                                }
                                .buttonStyle(TactileButtonStyle())

                                Button(action: { recordExamScore(2) }) {
                                    Text("Xuất sắc (2đ)")
                                        .font(.footnote.weight(.bold))
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .background(AppTheme.Colors.masteredBg)
                                        .foregroundColor(AppTheme.Colors.mastered)
                                        .cornerRadius(AppTheme.CornerRadius.medium)
                                }
                                .buttonStyle(TactileButtonStyle())
                            }
                        }
                        .padding()
                        .appCardStyle()
                        .padding(.horizontal)
                    } else {
                        Button(action: {
                            withAnimation { isAnswerRevealed = true }
                        }) {
                            HStack {
                                Image(systemName: "eye.fill")
                                Text("Nhẩm xong, lật xem đáp án đối chiếu")
                            }
                            .font(.headline)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(AppTheme.Colors.primary)
                            .foregroundColor(.white)
                            .cornerRadius(AppTheme.CornerRadius.medium)
                        }
                        .buttonStyle(TactileButtonStyle())
                        .padding(.horizontal)
                        .padding(.top, 12)
                    }
                }
            }
        }
    }

    // MARK: - 3. Result View
    private var examResultView: some View {
        VStack(spacing: 20) {
            Image(systemName: isExamPassed ? "trophy.fill" : "arrow.triangle.2.circlepath.circle.fill")
                .font(.system(size: 72))
                .foregroundColor(isExamPassed ? AppTheme.Colors.gold : AppTheme.Colors.learning)

            Text(isExamPassed ? "Chúc Mừng! Đã Đạt Yêu Cầu" : "Cần Ôn Luyện Thêm")
                .font(.title2.weight(.bold))

            Text("Kết quả: \(totalCurrentExamScore)/\(maxExamPoints) điểm (\(examPercent)%)")
                .font(.headline)
                .foregroundColor(.secondary)

            Button(action: {
                examQuestions.removeAll()
                isExamFinished = false
            }) {
                Text("Bắt đầu bài thi mới")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(AppTheme.Colors.primary)
                    .foregroundColor(.white)
                    .cornerRadius(AppTheme.CornerRadius.medium)
            }
            .buttonStyle(TactileButtonStyle())
            .padding(.horizontal, 32)
            .padding(.top, 16)
        }
        .padding()
    }

    private var totalCurrentExamScore: Int {
        examScores.values.reduce(0, +)
    }

    private func startExam(questionCount: Int) {
        examQuestions = Array(viewModel.questions.shuffled().prefix(questionCount))
        currentExamIndex = 0
        isAnswerRevealed = false
        isExamFinished = false
        examScores.removeAll()
    }

    private func recordExamScore(_ score: Int) {
        examScores[currentExamIndex] = score
        if currentExamIndex < examQuestions.count - 1 {
            currentExamIndex += 1
            isAnswerRevealed = false
        } else {
            isExamFinished = true
        }
    }
}
