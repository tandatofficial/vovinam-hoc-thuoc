import SwiftUI

/// Hàng danh sách câu hỏi tái sử dụng
public struct QuestionRowView: View {
    public let question: Question
    public var showScoreBadge: Bool = true
    public var showCategory: Bool = true
    public var showMnemonic: Bool = false
    public var onSelect: () -> Void

    public init(
        question: Question,
        showScoreBadge: Bool = true,
        showCategory: Bool = true,
        showMnemonic: Bool = false,
        onSelect: @escaping () -> Void
    ) {
        self.question = question
        self.showScoreBadge = showScoreBadge
        self.showCategory = showCategory
        self.showMnemonic = showMnemonic
        self.onSelect = onSelect
    }

    public var body: some View {
        Button(action: onSelect) {
            HStack(spacing: 12) {
                // Số thứ tự câu hỏi #1 - #10
                Text("#\(question.number)")
                    .font(.footnote.weight(.bold))
                    .frame(width: 34, height: 34)
                    .background(Color(.systemGray6))
                    .foregroundColor(AppTheme.Colors.primary)
                    .cornerRadius(AppTheme.CornerRadius.small)

                VStack(alignment: .leading, spacing: 3) {
                    Text(question.title)
                        .font(.subheadline.weight(.semibold))
                        .foregroundColor(.primary)
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)

                    if showMnemonic && !question.easyAnswer.mnemonic.isEmpty {
                        Text("💡 \(question.easyAnswer.mnemonic)")
                            .font(.caption2)
                            .foregroundColor(AppTheme.Colors.learning)
                            .lineLimit(1)
                    } else if showCategory {
                        Text(question.category)
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }

                Spacer()

                if showScoreBadge {
                    ScoreBadgeView(score: question.score)
                }

                Image(systemName: "chevron.right")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            .padding(.vertical, 8)
            .padding(.horizontal, 12)
            .background(Color(.systemBackground))
            .cornerRadius(AppTheme.CornerRadius.medium)
        }
        .buttonStyle(.plain)
    }
}
