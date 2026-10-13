import Foundation
import AVFoundation

public final class SpeechService: NSObject, ObservableObject, AVSpeechSynthesizerDelegate {
    public static let shared = SpeechService()

    private let synthesizer = AVSpeechSynthesizer()
    private var vietnameseVoice: AVSpeechSynthesisVoice?

    @Published public var isSpeaking: Bool = false
    @Published public var speechRate: Float = 0.50 // 0.45 (Chậm) - 0.52 (Chuẩn)

    private override init() {
        super.init()
        synthesizer.delegate = self
        setupAudioSession()
        setupVoice()
    }

    private func setupAudioSession() {
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .spokenAudio, options: [.duckOthers])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("Failed to set audio session category: \(error)")
        }
    }

    private func setupVoice() {
        // Tìm giọng tiếng Việt vi-VN
        let voices = AVSpeechSynthesisVoice.speechVoices()
        vietnameseVoice = voices.first(where: { $0.language == "vi-VN" || $0.language == "vi_VN" })
            ?? AVSpeechSynthesisVoice(language: "vi-VN")
    }

    public func speak(_ text: String) {
        stop()

        guard !text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }

        // Bật audio session
        try? AVAudioSession.sharedInstance().setActive(true)

        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = vietnameseVoice
        utterance.rate = speechRate
        utterance.pitchMultiplier = 1.0
        utterance.volume = 1.0

        isSpeaking = true
        synthesizer.speak(utterance)
    }

    public func stop() {
        if synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }
        isSpeaking = false
    }

    public func toggle(_ text: String) {
        if isSpeaking {
            stop()
        } else {
            speak(text)
        }
    }

    public func setSpeedSlow() {
        speechRate = 0.44 // Đọc chậm để học thuộc
    }

    public func setSpeedNormal() {
        speechRate = 0.50 // Tốc độ bình thường
    }

    // MARK: - AVSpeechSynthesizerDelegate

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didStart utterance: AVSpeechUtterance) {
        DispatchQueue.main.async {
            self.isSpeaking = true
        }
    }

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        DispatchQueue.main.async {
            self.isSpeaking = false
        }
    }

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        DispatchQueue.main.async {
            self.isSpeaking = false
        }
    }
}
