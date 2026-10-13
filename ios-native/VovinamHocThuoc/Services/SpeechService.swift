import Foundation
import AVFoundation

/// Protocol cho dịch vụ phát âm thanh Native Tiếng Việt
public protocol SpeechServiceProtocol: AnyObject {
    var isSpeaking: Bool { get }
    var speechRate: Float { get }
    func speak(_ text: String)
    func stop()
    func toggle(_ text: String)
    func setSpeedSlow()
    func setSpeedNormal()
}

public final class SpeechService: NSObject, ObservableObject, SpeechServiceProtocol, AVSpeechSynthesizerDelegate {
    public static let shared = SpeechService()

    private let synthesizer = AVSpeechSynthesizer()
    private var vietnameseVoice: AVSpeechSynthesisVoice?

    @Published public var isSpeaking: Bool = false
    @Published public var speechRate: Float = 0.50 // 0.44 (Chậm) - 0.50 (Chuẩn)

    private override init() {
        super.init()
        synthesizer.delegate = self
        setupAudioSession()
        setupVoice()
        registerInterruptionObserver()
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    private func setupAudioSession() {
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .spokenAudio, options: [.duckOthers])
        } catch {
            print("[SpeechService] Không thể thiết lập AVAudioSession: \(error)")
        }
    }

    private func setupVoice() {
        // Ưu tiên chọn giọng đọc Tiếng Việt (vi-VN / Apple Linh)
        let voices = AVSpeechSynthesisVoice.speechVoices()
        vietnameseVoice = voices.first(where: { $0.language == "vi-VN" || $0.language == "vi_VN" })
            ?? AVSpeechSynthesisVoice(language: "vi-VN")
    }

    private func registerInterruptionObserver() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleAudioInterruption),
            name: AVAudioSession.interruptionNotification,
            object: AVAudioSession.sharedInstance()
        )
    }

    @objc private func handleAudioInterruption(notification: Notification) {
        guard let info = notification.userInfo,
              let typeValue = info[AVAudioSessionInterruptionTypeKey] as? UInt,
              let type = AVAudioSession.InterruptionType(rawValue: typeValue) else { return }

        if type == .began {
            DispatchQueue.main.async { [weak self] in
                self?.stop()
            }
        }
    }

    // MARK: - Playback Control

    public func speak(_ text: String) {
        stop()

        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }

        do {
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("[SpeechService] Lỗi kích hoạt AVAudioSession: \(error)")
        }

        let utterance = AVSpeechUtterance(string: trimmed)
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
        speechRate = 0.44 // Đọc thong thả để dễ ngấm và nhẩm thuộc
    }

    public func setSpeedNormal() {
        speechRate = 0.50 // Tốc độ đàm thoại tự nhiên
    }

    // MARK: - AVSpeechSynthesizerDelegate

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didStart utterance: AVSpeechUtterance) {
        DispatchQueue.main.async { [weak self] in
            self?.isSpeaking = true
        }
    }

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        DispatchQueue.main.async { [weak self] in
            self?.isSpeaking = false
            try? AVAudioSession.sharedInstance().setActive(false, options: [.notifyOthersOnDeactivation])
        }
    }

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        DispatchQueue.main.async { [weak self] in
            self?.isSpeaking = false
            try? AVAudioSession.sharedInstance().setActive(false, options: [.notifyOthersOnDeactivation])
        }
    }
}
