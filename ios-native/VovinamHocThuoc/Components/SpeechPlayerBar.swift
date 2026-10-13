import SwiftUI

/// Thanh phát âm thanh Native Tiếng Việt (Người thật 100% qua file Audio, tua đoạn & tăng tốc cấp số cộng 0.25)
public struct SpeechPlayerBar: View {
    public let questionNumber: Int?
    public let isFull: Bool
    public let textToSpeak: String
    public var labelText: String
    public var buttonText: String?
    
    @ObservedObject private var speechService = SpeechService.shared
    @State private var isDraggingSlider: Bool = false
    @State private var dragSliderValue: Double = 0.0

    private var currentTrackId: String {
        guard let num = questionNumber else { return "tts" }
        return isFull ? "q\(num)_full" : "q\(num)"
    }

    private var isThisTrackActive: Bool {
        return speechService.currentPlayingId == currentTrackId
    }

    public init(
        questionNumber: Int? = nil,
        isFull: Bool = false,
        textToSpeak: String,
        labelText: String = "Giọng đọc Tiếng Việt (Người thật 100%)",
        buttonText: String? = nil
    ) {
        self.questionNumber = questionNumber
        self.isFull = isFull
        self.textToSpeak = textToSpeak
        self.labelText = labelText
        self.buttonText = buttonText
    }

    public var body: some View {
        VStack(spacing: 12) {
            // Header: Icon, Tiêu đề trạng thái & Bộ nút chỉnh tốc độ cấp số cộng 0.25
            HStack(alignment: .center) {
                HStack(spacing: 8) {
                    Image(systemName: isThisTrackActive && speechService.isSpeaking ? "waveform" : "speaker.wave.2.fill")
                        .font(.system(size: 16))
                        .foregroundColor(isThisTrackActive && speechService.isSpeaking ? AppTheme.Colors.unlearned : AppTheme.Colors.primary)

                    Text(isThisTrackActive && speechService.isSpeaking ? "Đang phát..." : (isThisTrackActive && speechService.isPaused ? "Đang tạm dừng" : labelText))
                        .font(.caption.weight(.bold))
                        .foregroundColor(.primary)
                        .lineLimit(1)
                }

                Spacer()

                // Bộ chọn tốc độ cấp số cộng 0.25 (0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 1.75x, 2.0x)
                HStack(spacing: 4) {
                    Button(action: { speechService.decreaseRate() }) {
                        Image(systemName: "minus")
                            .font(.system(size: 10, weight: .bold))
                            .frame(width: 22, height: 22)
                            .background(Color(.systemGray5))
                            .foregroundColor(.primary)
                            .clipShape(Circle())
                    }
                    .disabled(speechService.playbackRate <= 0.5)

                    Text(String(format: "%.2fx", speechService.playbackRate))
                        .font(.system(size: 11, weight: .bold, design: .monospaced))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 3)
                        .background(AppTheme.Colors.primary.opacity(0.15))
                        .foregroundColor(AppTheme.Colors.primary)
                        .cornerRadius(6)

                    Button(action: { speechService.increaseRate() }) {
                        Image(systemName: "plus")
                            .font(.system(size: 10, weight: .bold))
                            .frame(width: 22, height: 22)
                            .background(Color(.systemGray5))
                            .foregroundColor(.primary)
                            .clipShape(Circle())
                    }
                    .disabled(speechService.playbackRate >= 2.0)
                }
            }

            // Thanh tua Scrubber & Thời gian (chỉ hiển thị khi track đang hoạt động và có duration)
            if isThisTrackActive && speechService.duration > 0 {
                VStack(spacing: 4) {
                    Slider(
                        value: Binding(
                            get: {
                                isDraggingSlider ? dragSliderValue : speechService.currentTime
                            },
                            set: { newValue in
                                dragSliderValue = newValue
                            }
                        ),
                        in: 0...max(speechService.duration, 1.0),
                        onEditingChanged: { editing in
                            isDraggingSlider = editing
                            if !editing {
                                speechService.seek(to: dragSliderValue)
                            }
                        }
                    )
                    .accentColor(AppTheme.Colors.primary)

                    HStack {
                        Text(formatTime(isDraggingSlider ? dragSliderValue : speechService.currentTime))
                            .font(.caption2.monospacedDigit())
                            .foregroundColor(.secondary)

                        Spacer()

                        Text(formatTime(speechService.duration))
                            .font(.caption2.monospacedDigit())
                            .foregroundColor(.secondary)
                    }
                }

                // Cụm nút Tua lùi 5s / Play-Pause / Tua tới 5s
                HStack(spacing: 24) {
                    Button(action: { speechService.skip(by: -5) }) {
                        HStack(spacing: 2) {
                            Image(systemName: "gobackward.5")
                                .font(.system(size: 16, weight: .semibold))
                            Text("-5s")
                                .font(.system(size: 11, weight: .semibold))
                        }
                        .foregroundColor(.primary)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color(.systemGray5))
                        .cornerRadius(14)
                    }

                    Button(action: {
                        if speechService.isSpeaking {
                            speechService.pause()
                        } else if speechService.isPaused {
                            speechService.resume()
                        } else {
                            startPlaying()
                        }
                    }) {
                        Image(systemName: speechService.isSpeaking ? "pause.fill" : "play.fill")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 44, height: 44)
                            .background(AppTheme.Colors.primary)
                            .clipShape(Circle())
                    }

                    Button(action: { speechService.skip(by: 5) }) {
                        HStack(spacing: 2) {
                            Text("+5s")
                                .font(.system(size: 11, weight: .semibold))
                            Image(systemName: "goforward.5")
                                .font(.system(size: 16, weight: .semibold))
                        }
                        .foregroundColor(.primary)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color(.systemGray5))
                        .cornerRadius(14)
                    }

                    Spacer()

                    // Nút Dừng hẳn
                    Button(action: { speechService.stop() }) {
                        Image(systemName: "stop.fill")
                            .font(.system(size: 14))
                            .foregroundColor(AppTheme.Colors.unlearned)
                            .frame(width: 32, height: 32)
                            .background(AppTheme.Colors.unlearnedBg)
                            .clipShape(Circle())
                    }
                }
            } else {
                // Nút bấm Nghe To Bản khi chưa phát track này
                Button(action: {
                    startPlaying()
                }) {
                    HStack(spacing: 8) {
                        Image(systemName: "play.circle.fill")
                            .font(.system(size: 20))
                        Text(buttonText ?? (isFull ? "Nghe đọc toàn bộ nguyên văn chi tiết" : "Nghe đọc mẫu câu hỏi & ý cốt tử"))
                            .font(.subheadline.weight(.bold))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(AppTheme.Colors.primaryLight)
                    .foregroundColor(AppTheme.Colors.primary)
                    .cornerRadius(AppTheme.CornerRadius.medium)
                }
                .buttonStyle(TactileButtonStyle())
            }
        }
        .padding(12)
        .background(Color(.secondarySystemBackground))
        .cornerRadius(AppTheme.CornerRadius.medium)
    }

    private func startPlaying() {
        if let num = questionNumber {
            speechService.speakQuestion(number: num, isFull: isFull, fallbackText: textToSpeak)
        } else {
            speechService.speak(textToSpeak)
        }
    }

    private func formatTime(_ time: TimeInterval) -> String {
        let totalSeconds = Int(max(0, time))
        let minutes = totalSeconds / 60
        let seconds = totalSeconds % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }
}
