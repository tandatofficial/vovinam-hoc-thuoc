import SwiftUI

public struct ChunkStudyView: View {
    public let question: Question
    @StateObject private var speechService = SpeechService.shared

    @State private var activeChunkIndex: Int = 0
    @State private var isMasked: Bool = false
    @State private var learnedChunks: [Int: Bool] = [:]

    public init(question: Question) {
        self.question = question
    }

    private var chunks: [String] {
        if let c = question.chunks, !c.isEmpty {
            return c
        }
        return question.fullAnswer.paragraphs
    }

    public var body: some View {
        VStack(spacing: 16) {
            // Thanh tiến độ phân đoạn
            VStack(spacing: 6) {
                HStack {
                    Text("Đoạn \(activeChunkIndex + 1)/\(chunks.count)")
                        .font(.caption.weight(.bold))
                        .foregroundColor(AppTheme.Colors.primary)

                    Spacer()

                    Text("\(learnedChunks.filter { $0.value }.count)/\(chunks.count) đã thuộc")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                ProgressView(value: Double(learnedChunks.filter { $0.value }.count), total: Double(max(1, chunks.count)))
                    .tint(AppTheme.Colors.primary)
            }
            .padding(.horizontal)

            // Khung hiển thị phân đoạn đang học
            if !chunks.isEmpty && activeChunkIndex < chunks.count {
                chunkCard(currentText: chunks[activeChunkIndex])
            }

            // Thanh điều hướng đoạn trước / đoạn sau
            HStack(spacing: 12) {
                Button(action: {
                    if activeChunkIndex > 0 {
                        activeChunkIndex -= 1
                        speechService.stop()
                    }
                }) {
                    HStack {
                        Image(systemName: "chevron.left")
                        Text("Đoạn trước")
                    }
                    .font(.subheadline.weight(.bold))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(activeChunkIndex > 0 ? Color(.systemGray6) : Color(.systemGray6).opacity(0.4))
                    .foregroundColor(activeChunkIndex > 0 ? .primary : .secondary)
                    .cornerRadius(AppTheme.CornerRadius.medium)
                }
                .buttonStyle(TactileButtonStyle())
                .disabled(activeChunkIndex == 0)

                Button(action: {
                    if activeChunkIndex < chunks.count - 1 {
                        activeChunkIndex += 1
                        speechService.stop()
                    }
                }) {
                    HStack {
                        Text("Đoạn kế")
                        Image(systemName: "chevron.right")
                    }
                    .font(.subheadline.weight(.bold))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(activeChunkIndex < chunks.count - 1 ? AppTheme.Colors.primary : Color(.systemGray6).opacity(0.4))
                    .foregroundColor(activeChunkIndex < chunks.count - 1 ? .white : .secondary)
                    .cornerRadius(AppTheme.CornerRadius.medium)
                }
                .buttonStyle(TactileButtonStyle())
                .disabled(activeChunkIndex >= chunks.count - 1)
            }
            .padding(.horizontal)
        }
        .padding(.vertical, 8)
    }

    private func chunkCard(currentText: String) -> some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Label("Phân đoạn số \(activeChunkIndex + 1)", systemImage: "text.alignleft")
                    .font(.caption.weight(.bold))
                    .foregroundColor(.secondary)

                Spacer()

                Button(action: {
                    speechService.toggle(currentText)
                }) {
                    Image(systemName: speechService.isSpeaking ? "stop.circle.fill" : "speaker.wave.2.fill")
                        .font(.system(size: 20))
                        .foregroundColor(speechService.isSpeaking ? AppTheme.Colors.unlearned : AppTheme.Colors.primary)
                }
            }

            if isMasked {
                Text("•••• •••••• •••••• •••• (Đã ẩn để tự nhẩm thuộc)")
                    .font(.body)
                    .foregroundColor(.secondary)
                    .italic()
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .center)
            } else {
                Text(currentText)
                    .font(.system(size: 17, weight: .medium, design: .rounded))
                    .foregroundColor(.primary)
                    .lineSpacing(6)
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
            }

            HStack(spacing: 12) {
                Button(action: {
                    isMasked.toggle()
                }) {
                    Label(isMasked ? "Hiện chữ" : "Ẩn để nhẩm", systemImage: isMasked ? "eye.fill" : "eye.slash.fill")
                        .font(.footnote.weight(.semibold))
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(Color(.systemGray6))
                        .cornerRadius(AppTheme.CornerRadius.small)
                }
                .buttonStyle(TactileButtonStyle())

                Spacer()

                Button(action: {
                    learnedChunks[activeChunkIndex] = !(learnedChunks[activeChunkIndex] ?? false)
                }) {
                    let isDone = learnedChunks[activeChunkIndex] ?? false
                    Label(isDone ? "Đã thuộc" : "Chưa thuộc", systemImage: isDone ? "checkmark.circle.fill" : "circle")
                        .font(.footnote.weight(.bold))
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(isDone ? AppTheme.Colors.masteredBg : Color(.systemGray6))
                        .foregroundColor(isDone ? AppTheme.Colors.mastered : .primary)
                        .cornerRadius(AppTheme.CornerRadius.small)
                }
                .buttonStyle(TactileButtonStyle())
            }
        }
        .padding()
        .appCardStyle()
        .padding(.horizontal)
    }
}
