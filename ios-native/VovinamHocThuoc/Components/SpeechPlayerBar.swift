import SwiftUI

/// Thanh phát âm thanh Native Tiếng Việt tái sử dụng
public struct SpeechPlayerBar: View {
    public let textToSpeak: String
    public var labelText: String = "Giọng đọc Tiếng Việt (Apple vi-VN)"
    
    @ObservedObject private var speechService = SpeechService.shared

    public init(textToSpeak: String, labelText: String = "Giọng đọc Tiếng Việt (Apple vi-VN)") {
        self.textToSpeak = textToSpeak
        self.labelText = labelText
    }

    public var body: some View {
        VStack(spacing: 10) {
            HStack {
                HStack(spacing: 8) {
                    Image(systemName: speechService.isSpeaking ? "waveform" : "speaker.wave.2.fill")
                        .font(.system(size: 16))
                        .foregroundColor(speechService.isSpeaking ? AppTheme.Colors.unlearned : AppTheme.Colors.primary)

                    Text(speechService.isSpeaking ? "Đang đọc mẫu..." : labelText)
                        .font(.caption.weight(.bold))
                        .foregroundColor(.primary)
                }

                Spacer()

                // Nút chỉnh tốc độ đọc (0.8x / 1.0x)
                HStack(spacing: 4) {
                    Button(action: { speechService.setSpeedSlow() }) {
                        Text("0.8x")
                            .font(.system(size: 11, weight: .bold))
                            .padding(.horizontal, 7)
                            .padding(.vertical, 3)
                            .background(speechService.speechRate < 0.48 ? AppTheme.Colors.primary : Color(.systemGray5))
                            .foregroundColor(speechService.speechRate < 0.48 ? .white : .secondary)
                            .cornerRadius(6)
                    }

                    Button(action: { speechService.setSpeedNormal() }) {
                        Text("1.0x")
                            .font(.system(size: 11, weight: .bold))
                            .padding(.horizontal, 7)
                            .padding(.vertical, 3)
                            .background(speechService.speechRate >= 0.48 ? AppTheme.Colors.primary : Color(.systemGray5))
                            .foregroundColor(speechService.speechRate >= 0.48 ? .white : .secondary)
                            .cornerRadius(6)
                    }
                }
            }

            // Nút bấm Nghe / Dừng To Bản
            Button(action: {
                speechService.toggle(textToSpeak)
            }) {
                HStack(spacing: 8) {
                    Image(systemName: speechService.isSpeaking ? "stop.circle.fill" : "play.circle.fill")
                        .font(.system(size: 20))
                    Text(speechService.isSpeaking ? "Dừng giọng đọc" : "Nghe đọc mẫu câu hỏi & ý cốt tử")
                        .font(.subheadline.weight(.bold))
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .background(speechService.isSpeaking ? AppTheme.Colors.unlearnedBg : AppTheme.Colors.primaryLight)
                .foregroundColor(speechService.isSpeaking ? AppTheme.Colors.unlearned : AppTheme.Colors.primary)
                .cornerRadius(AppTheme.CornerRadius.medium)
            }
        }
        .padding(12)
        .background(Color(.secondarySystemBackground))
        .cornerRadius(AppTheme.CornerRadius.medium)
    }
}
