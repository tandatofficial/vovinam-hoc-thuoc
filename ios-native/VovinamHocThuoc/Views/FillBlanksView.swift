import SwiftUI

public struct FillBlanksView: View {
    public let question: Question

    @State private var userAnswers: [Int: String] = [:]
    @State private var isChecked: Bool = false

    public init(question: Question) {
        self.question = question
    }

    private var clozeItems: [ClozeItem] {
        if let items = question.clozeItems, !items.isEmpty {
            return items
        }
        return [
            ClozeItem(
                prompt: "Tôn chỉ Vovinam: Việt Võ Đạo lấy cứu cánh {0} con người làm cứu cánh, lấy {1} làm phương châm.",
                answers: ["Phục vụ", "Đại đồng"],
                distractors: ["Chiến đấu", "Đoàn kết", "Bảo vệ"]
            )
        ]
    }

    private func wordsBank(for item: ClozeItem) -> [String] {
        (item.answers + (item.distractors ?? [])).shuffled()
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Label("Điền từ còn thiếu vào chỗ trống", systemImage: "character.cursor.ibeam")
                .font(.subheadline.weight(.bold))
                .foregroundColor(AppTheme.Colors.primary)
                .padding(.horizontal)

            ForEach(Array(clozeItems.enumerated()), id: \.offset) { itemIndex, item in
                VStack(alignment: .leading, spacing: 14) {
                    Text(renderPromptText(item.prompt, answers: item.answers, itemIndex: itemIndex))
                        .font(.system(size: 16, weight: .medium, design: .rounded))
                        .lineSpacing(6)
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(.systemBackground))
                        .cornerRadius(AppTheme.CornerRadius.medium)
                        .overlay(
                            RoundedRectangle(cornerRadius: AppTheme.CornerRadius.medium)
                                .stroke(AppTheme.Colors.border, lineWidth: 1)
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
                                            .font(.footnote.weight(.bold))
                                            .padding(.horizontal, 12)
                                            .padding(.vertical, 8)
                                            .background(AppTheme.Colors.primaryLight)
                                            .foregroundColor(AppTheme.Colors.primary)
                                            .cornerRadius(AppTheme.CornerRadius.small)
                                    }
                                    .buttonStyle(TactileButtonStyle())
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
                                .font(.footnote.weight(.bold))
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 10)
                                .background(AppTheme.Colors.primary)
                                .foregroundColor(.white)
                                .cornerRadius(AppTheme.CornerRadius.small)
                        }
                        .buttonStyle(TactileButtonStyle())

                        Button(action: {
                            userAnswers.removeAll()
                            isChecked = false
                        }) {
                            Text("Làm lại")
                                .font(.footnote.weight(.semibold))
                                .padding(.horizontal, 16)
                                .padding(.vertical, 10)
                                .background(Color(.systemGray6))
                                .foregroundColor(.primary)
                                .cornerRadius(AppTheme.CornerRadius.small)
                        }
                        .buttonStyle(TactileButtonStyle())
                    }
                }
                .padding()
                .background(AppTheme.Colors.secondaryCardBackground)
                .cornerRadius(AppTheme.CornerRadius.large)
                .padding(.horizontal)
            }
        }
        .padding(.vertical, 8)
    }

    private func renderPromptText(_ prompt: String, answers: [String], itemIndex: Int) -> AttributedString {
        var result = AttributedString(prompt)

        for (index, answer) in answers.enumerated() {
            let placeholder = "{\(index)}"
            if let range = result.range(of: placeholder) {
                if let userWord = userAnswers[index] {
                    var filled = AttributedString(" [ \(userWord) ] ")
                    if isChecked {
                        let isCorrect = userWord.trimmingCharacters(in: .whitespacesAndNewlines).lowercased() ==
                            answer.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
                        filled.foregroundColor = isCorrect ? AppTheme.Colors.mastered : AppTheme.Colors.unlearned
                    } else {
                        filled.foregroundColor = AppTheme.Colors.primary
                    }
                    result.replaceSubrange(range, with: filled)
                } else {
                    var empty = AttributedString(" [ _____ ] ")
                    empty.foregroundColor = .secondary
                    result.replaceSubrange(range, with: empty)
                }
            }
        }

        return result
    }
}
