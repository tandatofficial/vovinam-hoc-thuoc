import SwiftUI

public struct KeyPointsChecklistView: View {
    public let question: Question
    @State private var checkedItems: [Int: Bool] = [:]

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
                    .font(.subheadline)
                    .fontWeight(.bold)
                    .foregroundColor(.blue)

                Spacer()

                let doneCount = checkedItems.filter { $0.value }.count
                Text("\(doneCount)/\(items.count) ý")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(doneCount == items.count && !items.isEmpty ? .green : .secondary)
            }
            .padding(.horizontal)

            VStack(spacing: 10) {
                ForEach(Array(items.enumerated()), id: \.offset) { index, point in
                    let isChecked = checkedItems[index] ?? false

                    Button(action: {
                        checkedItems[index] = !isChecked
                    }) {
                        HStack(alignment: .top, spacing: 12) {
                            Image(systemName: isChecked ? "checkmark.circle.fill" : "circle")
                                .font(.system(size: 20))
                                .foregroundColor(isChecked ? .green : .secondary)
                                .padding(.top, 2)

                            Text(point)
                                .font(.subheadline)
                                .fontWeight(isChecked ? .semibold : .regular)
                                .foregroundColor(isChecked ? .primary : .secondary)
                                .strikethrough(isChecked, color: .green.opacity(0.6))
                                .multilineTextAlignment(.leading)
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }
                        .padding()
                        .background(isChecked ? Color.green.opacity(0.08) : Color(.systemBackground))
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(isChecked ? Color.green.opacity(0.3) : Color(.systemGray5), lineWidth: 1)
                        )
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal)
        }
        .padding(.vertical, 8)
    }
}
