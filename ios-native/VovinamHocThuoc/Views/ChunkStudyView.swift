import SwiftUI

public struct ChunkStudyView: View {
    public let question: Question
    @StateObject private var speechService = SpeechService.shared

    @State private var activeChunkIndex: Int = 0
    @State private var isMasked: Bool = false
    @State private var learnedChunks: [Int: Bool] = [:]

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
                        .font(.caption)
                        .fontWeight(.bold)
                        .foregroundColor(.blue)

                    Spacer()

                    Text("\(learnedChunks.filter { $0.value }.count)/\(chunks.count) đã thuộc")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                ProgressView(value: Double(learnedChunks.filter { $0.value }.count), total: Double(max(1, chunks.count)))
                    .tint(.blue)
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
                    .font(.subheadline)
                    .fontWeight(.bold)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(activeChunkIndex > 0 ? Color(.systemGray6) : Color(.systemGray6).opacity(0.4))
                    .foregroundColor(activeChunkIndex > 0 ? .primary : .secondary)
                    .cornerRadius(12)
                }
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
                    .font(.subheadline)
                    .fontWeight(.bold)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(activeChunkIndex < chunks.count - 1 ? Color.blue : Color(.systemGray6).opacity(0.4))
                    .foregroundColor(activeChunkIndex < chunks.count - 1 ? .white : .secondary)
                    .cornerRadius(12)
                }
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
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(.secondary)

                Spacer()

                Button(action: {
                    speechService.toggle(currentText)
                }) {
                    Image(systemName: speechService.isSpeaking ? "stop.circle.fill" : "speaker.wave.2.fill")
                        .font(.system(size: 20))
                        .foregroundColor(speechService.isSpeaking ? .red : .blue)
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
                        .font(.footnote)
                        .fontWeight(.semibold)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(Color(.systemGray6))
                        .cornerRadius(10)
                }

                Spacer()

                Button(action: {
                    learnedChunks[activeChunkIndex] = !(learnedChunks[activeChunkIndex] ?? false)
                }) {
                    let isDone = learnedChunks[activeChunkIndex] ?? false
                    Label(isDone ? "Đã thuộc" : "Chưa thuộc", systemImage: isDone ? "checkmark.circle.fill" : "circle")
                        .font(.footnote)
                        .fontWeight(.bold)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(isDone ? Color.green.opacity(0.15) : Color(.systemGray6))
                        .foregroundColor(isDone ? .green : .primary)
                        .cornerRadius(10)
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 3)
        .padding(.horizontal)
    }
}
