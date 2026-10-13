import SwiftUI

public struct ExamView: View {
    @ObservedObject var viewModel: StudyViewModel

    @State private var examQuestions: [Question] = []
    @State private var currentExamIndex: Int = 0
    @State private var isAnswerRevealed: Bool = false
    @State private var isExamFinished: Bool = false
    @State private var examScores: [Int: Int] = [:] // index -> score

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

    // MARK: - Start View
    private var examStartView: some View {
        VStack(spacing: 20) {
            Image(systemName: "graduationcap.circle.fill")
                .font(.system(size: 72))
                .foregroundColor(.blue)

            Text("Phòng Thi Thử Vấn Đáp")
                .font(.title2)
                .fontWeight(.bold)

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
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(14)
                }

                Button(action: { startExam(questionCount: 10) }) {
                    Text("Thi toàn diện (Trọn bộ 10 câu)")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(Color(.systemGray6))
                        .foregroundColor(.primary)
                        .cornerRadius(14)
                }
            }
            .padding(.horizontal, 24)
            .padding(.top, 16)
        }
        .padding()
    }

    // MARK: - Active Exam View
    private var examActiveView: some View {
        ScrollView {
            if currentExamIndex < examQuestions.count {
                let q = examQuestions[currentExamIndex]

                VStack(spacing: 16) {
                    // Progress
                    HStack {
                        Text("Câu \(currentExamIndex + 1)/\(examQuestions.count)")
                            .font(.subheadline)
                            .fontWeight(.bold)
                            .foregroundColor(.blue)

                        Spacer()

                        Text("Điểm tạm tính: \(totalCurrentExamScore)đ")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding(.horizontal)

                    // Question Card
                    VStack(alignment: .leading, spacing: 12) {
                        Text("CÂU HỎI VẤN ĐÁP")
                            .font(.caption2)
                            .fontWeight(.black)
                            .foregroundColor(.blue)

                        Text(q.title)
                            .font(.title3)
                            .fontWeight(.bold)
                            .foregroundColor(.primary)
                    }
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(.systemBackground))
                    .cornerRadius(16)
                    .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 3)
                    .padding(.horizontal)

                    // Lật xem đáp án
                    if isAnswerRevealed {
                        VStack(alignment: .leading, spacing: 12) {
                            Label("Đáp án mẫu chuẩn", systemImage: "checkmark.seal.fill")
                                .font(.caption)
                                .fontWeight(.bold)
                                .foregroundColor(.green)

                            Text(q.easyAnswer.headlineQuote)
                                .font(.headline)
                                .fontWeight(.bold)
                                .foregroundColor(.primary)

                            Text(q.easyAnswer.coreMeaning)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                        }
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color.green.opacity(0.08))
                        .cornerRadius(16)
                        .padding(.horizontal)

                        // Đánh giá điểm thi
                        VStack(spacing: 8) {
                            Text("TỰ CHẤM ĐIỂM CÂU NÀY")
                                .font(.caption2)
                                .fontWeight(.bold)
                                .foregroundColor(.secondary)

                            HStack(spacing: 10) {
                                Button(action: { recordExamScore(0) }) {
                                    Text("Chưa đạt (0đ)")
                                        .font(.footnote)
                                        .fontWeight(.bold)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .background(Color.red.opacity(0.15))
                                        .foregroundColor(.red)
                                        .cornerRadius(12)
                                }

                                Button(action: { recordExamScore(1) }) {
                                    Text("Đạt 50% (1đ)")
                                        .font(.footnote)
                                        .fontWeight(.bold)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .background(Color.orange.opacity(0.15))
                                        .foregroundColor(.orange)
                                        .cornerRadius(12)
                                }

                                Button(action: { recordExamScore(2) }) {
                                    Text("Xuất sắc (2đ)")
                                        .font(.footnote)
                                        .fontWeight(.bold)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 12)
                                        .background(Color.green.opacity(0.15))
                                        .foregroundColor(.green)
                                        .cornerRadius(12)
                                }
                            }
                        }
                        .padding()
                        .background(Color(.systemBackground))
                        .cornerRadius(16)
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
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(14)
                        }
                        .padding(.horizontal)
                        .padding(.top, 12)
                    }
                }
            }
        }
    }

    // MARK: - Result View
    private var examResultView: some View {
        VStack(spacing: 20) {
            Image(systemName: isExamPassed ? "trophy.fill" : "arrow.triangle.2.circlepath.circle.fill")
                .font(.system(size: 72))
                .foregroundColor(isExamPassed ? .yellow : .orange)

            Text(isExamPassed ? "Chúc Mừng! Đã Đạt Yêu Cầu" : "Cần Ôn Luyện Thêm")
                .font(.title2)
                .fontWeight(.bold)

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
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(14)
            }
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
        let q = examQuestions[currentExamIndex]
        viewModel.updateScore(questionId: q.id, score: score)

        if currentExamIndex < examQuestions.count - 1 {
            currentExamIndex += 1
            isAnswerRevealed = false
        } else {
            isExamFinished = true
        }
    }
}
