import Foundation
import AVFoundation

/// Protocol cho dịch vụ phát âm thanh Native Tiếng Việt (Hỗ trợ cả Audio thực tế & TTS)
public protocol SpeechServiceProtocol: AnyObject {
    var isSpeaking: Bool { get }
    var speechRate: Float { get }
    func speak(_ text: String)
    func speakQuestion(number: Int, fallbackText: String)
    func stop()
    func toggle(_ text: String)
    func toggleQuestion(number: Int, fallbackText: String)
    func setSpeedSlow()
    func setSpeedNormal()
}

public final class SpeechService: NSObject, ObservableObject, SpeechServiceProtocol, AVSpeechSynthesizerDelegate, AVAudioPlayerDelegate {
    public static let shared = SpeechService()

    private let synthesizer = AVSpeechSynthesizer()
    private var audioPlayer: AVAudioPlayer?
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

    /// Phát file âm thanh người Việt thật 100% nếu có sẵn, fallback sang TTS nếu không tìm thấy
    public func speakQuestion(number: Int, fallbackText: String) {
        stop()

        // Tìm file q{number}.mp3 trong bundle (Resources hoặc Resources/Audio)
        var audioURL = Bundle.main.url(forResource: "q\(number)", withExtension: "mp3")
        if audioURL == nil {
            audioURL = Bundle.main.url(forResource: "q\(number)", withExtension: "mp3", subdirectory: "Audio")
        }

        if let url = audioURL {
            do {
                try AVAudioSession.sharedInstance().setActive(true)
                let player = try AVAudioPlayer(contentsOf: url)
                player.delegate = self
                player.enableRate = true
                player.rate = (speechRate < 0.48) ? 0.85 : 1.0
                player.prepareToPlay()
                player.play()
                self.audioPlayer = player
                self.isSpeaking = true
                return
            } catch {
                print("[SpeechService] Không thể phát file âm thanh \(url.lastPathComponent): \(error)")
            }
        }

        // Fallback sang synthesizer nếu không có file âm thanh
        speak(fallbackText)
    }

    public func toggleQuestion(number: Int, fallbackText: String) {
        if isSpeaking {
            stop()
        } else {
            speakQuestion(number: number, fallbackText: fallbackText)
        }
    }

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
        if let player = audioPlayer, player.isPlaying {
            player.stop()
        }
        audioPlayer = nil

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
        speechRate = 0.44
        if let player = audioPlayer {
            player.rate = 0.85
        }
    }

    public func setSpeedNormal() {
        speechRate = 0.50
        if let player = audioPlayer {
            player.rate = 1.0
        }
    }

    // MARK: - AVAudioPlayerDelegate

    public func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        DispatchQueue.main.async { [weak self] in
            self?.isSpeaking = false
            self?.audioPlayer = nil
            try? AVAudioSession.sharedInstance().setActive(false, options: [.notifyOthersOnDeactivation])
        }
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
