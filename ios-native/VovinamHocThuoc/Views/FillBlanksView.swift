import SwiftUI

public struct FillBlanksView: View {
    public let question: Question
    @State private var userAnswers: [Int: String] = [:]
    @State private var isChecked: Bool = false

    private var clozeItems: [ClozeItem] {
        if let data = question.clozeData, !data.isEmpty {
            return data
        }
        return [
            ClozeItem(
                prompt: "Vovinam do Cố Võ sư Sáng tổ {0} sáng lập năm {1} tại {2}.",
                answers: ["Nguyễn Lộc", "1938", "Hà Nội"],
                distractors: ["Lê Sáng", "1960", "Sài Gòn"]
            )
        ]
    }

    private func wordsBank(for item: ClozeItem) -> [String] {
        (item.answers + (item.distractors ?? [])).shuffled()
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Label("Điền từ còn thiếu vào chỗ trống", systemImage: "character.cursor.ibeam")
                .font(.subheadline)
                .fontWeight(.bold)
                .foregroundColor(.blue)
                .padding(.horizontal)

            ForEach(Array(clozeItems.enumerated()), id: \.offset) { itemIndex, item in
                VStack(alignment: .leading, spacing: 14) {
                    Text(renderPromptText(item.prompt, answers: item.answers, itemIndex: itemIndex))
                        .font(.system(size: 16, weight: .medium, design: .rounded))
                        .lineSpacing(6)
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(.systemBackground))
                        .cornerRadius(14)
                        .overlay(
                            RoundedRectangle(cornerRadius: 14)
                                .stroke(Color(.systemGray5), lineWidth: 1)
                        )

                    // Ngân hàng từ lựa chọn
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Ngân hàng từ gợi ý:")
                            .font(.caption)
                            .foregroundColor(.secondary)

                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(wordsBank(for: item), id: \.self) { word in
                                    Button(action: {
                                        for i in 0..<item.answers.count {
                                            if userAnswers[i] == nil {
                                                userAnswers[i] = word
                                                break
                                            }
                                        }
                                    }) {
                                        Text(word)
                                            .font(.footnote)
                                            .fontWeight(.bold)
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 8)
                                            .background(Color.blue.opacity(0.12))
                                            .foregroundColor(.blue)
                                            .cornerRadius(10)
                                    }
                                }
                            }
                        }
                    }

                    // Nút kiểm tra đáp án
                    HStack {
                        Button(action: {
                            isChecked = true
                        }) {
                            Text("Kiểm tra kết quả")
                                .font(.footnote)
                                .fontWeight(.bold)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                                .background(Color.blue)
                                .foregroundColor(.white)
                                .cornerRadius(10)
                        }

                        Button(action: {
                            userAnswers.removeAll()
                            isChecked = false
                        }) {
                            Text("Làm lại")
                                .font(.footnote)
                                .fontWeight(.semibold)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 10)
                                .background(Color(.systemGray6))
                                .foregroundColor(.primary)
                                .cornerRadius(10)
                        }
                    }
                }
                .padding()
                .background(Color(.secondarySystemBackground))
                .cornerRadius(16)
                .padding(.horizontal)
            }
        }
        .padding(.vertical, 8)
    }

    private func renderPromptText(_ prompt: String, answers: [String], itemIndex: Int) -> String {
        var result = prompt
        for (i, ans) in answers.enumerated() {
            let userAns = userAnswers[i]
            let display = isChecked ? "\(userAns ?? "___") (\(ans))" : (userAns ?? " [......] ")
            result = result.replacingOccurrences(of: "{\(i)}", with: display)
        }
        return result
    }
}
