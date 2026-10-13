import SwiftUI

public struct KeyPointsChecklistView: View {
    public let question: Question
    @State private var checkedItems: [Int: Bool] = [:]

    public init(question: Question) {
        self.question = question
    }

    private var items: [String] {
        if let kp = question.keyPoints, !kp.isEmpty {
            return kp
        }
        return question.fullAnswer.paragraphs
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Label("Checklist các ý bắt buộc", systemImage: "checklist")
                    .font(.subheadline.weight(.bold))
                    .foregroundColor(AppTheme.Colors.primary)

                Spacer()

                let doneCount = checkedItems.filter { $0.value }.count
                Text("\(doneCount)/\(items.count) ý")
                    .font(.caption.weight(.bold))
                    .foregroundColor(doneCount == items.count && !items.isEmpty ? AppTheme.Colors.mastered : .secondary)
            }
            .padding(.horizontal)

            VStack(spacing: 10) {
                ForEach(Array(items.enumerated()), id: \.offset) { index, point in
                    itemRow(index: index, point: point)
                }
            }
            .padding(.horizontal)
        }
        .padding(.vertical, 8)
    }

    private func itemRow(index: Int, point: String) -> some View {
        let isChecked = checkedItems[index] ?? false

        return Button(action: {
            checkedItems[index] = !isChecked
        }) {
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: isChecked ? "checkmark.circle.fill" : "circle")
                    .font(.system(size: 20))
                    .foregroundColor(isChecked ? AppTheme.Colors.mastered : .secondary)
                    .padding(.top, 2)

                Text(point)
                    .font(.subheadline.weight(isChecked ? .semibold : .regular))
                    .foregroundColor(isChecked ? .primary : .secondary)
                    .strikethrough(isChecked, color: AppTheme.Colors.mastered.opacity(0.6))
                    .multilineTextAlignment(.leading)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding()
            .background(isChecked ? AppTheme.Colors.masteredBg : Color(.systemBackground))
            .cornerRadius(AppTheme.CornerRadius.medium)
            .overlay(
                RoundedRectangle(cornerRadius: AppTheme.CornerRadius.medium)
                    .stroke(isChecked ? AppTheme.Colors.mastered.opacity(0.3) : AppTheme.Colors.border, lineWidth: 1)
            )
        }
        .buttonStyle(TactileButtonStyle())
    }
}
