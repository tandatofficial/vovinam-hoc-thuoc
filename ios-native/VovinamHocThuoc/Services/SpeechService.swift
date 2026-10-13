import Foundation
import AVFoundation

/// Protocol cho dịch vụ phát âm thanh Native Tiếng Việt (Hỗ trợ cả Audio thực tế & TTS)
public protocol SpeechServiceProtocol: AnyObject {
    var isSpeaking: Bool { get }
    var playbackRate: Float { get }
    var currentTime: TimeInterval { get }
    var duration: TimeInterval { get }
    
    func speak(_ text: String)
    func speakQuestion(number: Int, fallbackText: String)
    func speakQuestion(number: Int, isFull: Bool, fallbackText: String)
    func stop()
    func pause()
    func resume()
    func toggle(_ text: String)
    func toggleQuestion(number: Int, fallbackText: String)
    func toggleQuestion(number: Int, isFull: Bool, fallbackText: String)
    
    // Scrubber & Speed Controls
    func seek(to time: TimeInterval)
    func skip(by seconds: TimeInterval)
    func setRate(_ rate: Float)
    func increaseRate()
    func decreaseRate()
}

public final class SpeechService: NSObject, ObservableObject, SpeechServiceProtocol, AVSpeechSynthesizerDelegate, AVAudioPlayerDelegate {
    public static let shared = SpeechService()

    private let synthesizer = AVSpeechSynthesizer()
    private var audioPlayer: AVAudioPlayer?
    private var vietnameseVoice: AVSpeechSynthesisVoice?
    private var displayLinkTimer: Timer?

    // Tốc độ hợp lệ theo cấp số cộng 0.25: từ 0.5x đến 2.0x
    public static let speedSteps: [Float] = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]

    @Published public var isSpeaking: Bool = false
    @Published public var isPaused: Bool = false
    @Published public var playbackRate: Float = 1.0
    @Published public var currentTime: TimeInterval = 0
    @Published public var duration: TimeInterval = 0
    @Published public var currentPlayingId: String? = nil

    private override init() {
        super.init()
        synthesizer.delegate = self
        setupAudioSession()
        setupVoice()
        registerInterruptionObserver()
    }

    deinit {
        stopTimer()
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

    // MARK: - Timer Tracking
    private func startTimer() {
        stopTimer()
        displayLinkTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            guard let self = self, let player = self.audioPlayer else { return }
            self.currentTime = player.currentTime
            self.duration = player.duration
        }
    }

    private func stopTimer() {
        displayLinkTimer?.invalidate()
        displayLinkTimer = nil
    }

    // MARK: - Playback Control

    public func speakQuestion(number: Int, fallbackText: String) {
        speakQuestion(number: number, isFull: false, fallbackText: fallbackText)
    }

    public func speakQuestion(number: Int, isFull: Bool, fallbackText: String) {
        let trackId = isFull ? "q\(number)_full" : "q\(number)"
        
        // Nếu cùng track đang phát, toggle dừng lại
        if isSpeaking && currentPlayingId == trackId {
            stop()
            return
        }

        stop()
        currentPlayingId = trackId

        // Tìm file q{number}.mp3 hoặc q{number}_full.mp3 trong bundle
        var audioURL = Bundle.main.url(forResource: trackId, withExtension: "mp3")
        if audioURL == nil {
            audioURL = Bundle.main.url(forResource: trackId, withExtension: "mp3", subdirectory: "Audio")
        }

        if let url = audioURL {
            do {
                try AVAudioSession.sharedInstance().setActive(true)
                let player = try AVAudioPlayer(contentsOf: url)
                player.delegate = self
                player.enableRate = true
                player.rate = playbackRate
                player.prepareToPlay()
                player.play()
                
                self.audioPlayer = player
                self.duration = player.duration
                self.currentTime = 0
                self.isSpeaking = true
                self.isPaused = false
                startTimer()
                return
            } catch {
                print("[SpeechService] Không thể phát file âm thanh \(url.lastPathComponent): \(error)")
            }
        }

        // Fallback sang synthesizer nếu không có file âm thanh
        speak(fallbackText)
    }

    public func toggleQuestion(number: Int, fallbackText: String) {
        toggleQuestion(number: number, isFull: false, fallbackText: fallbackText)
    }

    public func toggleQuestion(number: Int, isFull: Bool, fallbackText: String) {
        let trackId = isFull ? "q\(number)_full" : "q\(number)"
        if isSpeaking && currentPlayingId == trackId {
            stop()
        } else {
            speakQuestion(number: number, isFull: isFull, fallbackText: fallbackText)
        }
    }

    public func speak(_ text: String) {
        stop()

        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }

        currentPlayingId = "tts"

        do {
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("[SpeechService] Lỗi kích hoạt AVAudioSession: \(error)")
        }

        let utterance = AVSpeechUtterance(string: trimmed)
        utterance.voice = vietnameseVoice
        // Map rate 0.5 -> 2.0x sang AVSpeechUtterance rate (0.35 -> 0.65)
        utterance.rate = min(max(0.5 * (playbackRate / 1.0), 0.35), 0.65)
        utterance.pitchMultiplier = 1.0
        utterance.volume = 1.0

        isSpeaking = true
        isPaused = false
        synthesizer.speak(utterance)
    }

    public func pause() {
        if let player = audioPlayer, player.isPlaying {
            player.pause()
            isPaused = true
            isSpeaking = false
            stopTimer()
        } else if synthesizer.isSpeaking {
            synthesizer.pauseSpeaking(at: .immediate)
            isPaused = true
            isSpeaking = false
        }
    }

    public func resume() {
        if let player = audioPlayer, isPaused {
            player.play()
            isPaused = false
            isSpeaking = true
            startTimer()
        } else if synthesizer.isPaused {
            synthesizer.continueSpeaking()
            isPaused = false
            isSpeaking = true
        }
    }

    public func stop() {
        stopTimer()
        if let player = audioPlayer {
            player.stop()
        }
        audioPlayer = nil

        if synthesizer.isSpeaking || synthesizer.isPaused {
            synthesizer.stopSpeaking(at: .immediate)
        }
        isSpeaking = false
        isPaused = false
        currentTime = 0
        currentPlayingId = nil
    }

    public func toggle(_ text: String) {
        if isSpeaking {
            stop()
        } else {
            speak(text)
        }
    }

    // MARK: - Scrubber & Speed Controls (Cấp số cộng 0.25: 0.5x -> 2.0x)

    public func seek(to time: TimeInterval) {
        guard let player = audioPlayer else { return }
        let clampedTime = max(0, min(player.duration, time))
        player.currentTime = clampedTime
        currentTime = clampedTime
    }

    public func skip(by seconds: TimeInterval) {
        guard let player = audioPlayer else { return }
        seek(to: player.currentTime + seconds)
    }

    public func setRate(_ rate: Float) {
        let clampedRate = max(0.5, min(2.0, rate))
        playbackRate = clampedRate
        if let player = audioPlayer {
            player.enableRate = true
            player.rate = clampedRate
        }
    }

    public func increaseRate() {
        // Cấp số cộng 0.25
        let current = playbackRate
        let next = SpeechService.speedSteps.first(where: { $0 > current + 0.01 }) ?? 2.0
        setRate(next)
    }

    public func decreaseRate() {
        // Cấp số cộng 0.25
        let current = playbackRate
        let prev = SpeechService.speedSteps.last(where: { $0 < current - 0.01 }) ?? 0.5
        setRate(prev)
    }

    // Legacy helpers
    public func setSpeedSlow() {
        setRate(0.75)
    }

    public func setSpeedNormal() {
        setRate(1.0)
    }

    // MARK: - AVAudioPlayerDelegate

    public func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            self.stopTimer()
            self.isSpeaking = false
            self.isPaused = false
            self.currentTime = 0
            self.currentPlayingId = nil
            self.audioPlayer = nil
            try? AVAudioSession.sharedInstance().setActive(false, options: [.notifyOthersOnDeactivation])
        }
    }

    // MARK: - AVSpeechSynthesizerDelegate

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didStart utterance: AVSpeechUtterance) {
        DispatchQueue.main.async { [weak self] in
            self?.isSpeaking = true
            self?.isPaused = false
        }
    }

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        DispatchQueue.main.async { [weak self] in
            self?.isSpeaking = false
            self?.isPaused = false
            self?.currentPlayingId = nil
            try? AVAudioSession.sharedInstance().setActive(false, options: [.notifyOthersOnDeactivation])
        }
    }

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        DispatchQueue.main.async { [weak self] in
            self?.isSpeaking = false
            self?.isPaused = false
            self?.currentPlayingId = nil
            try? AVAudioSession.sharedInstance().setActive(false, options: [.notifyOthersOnDeactivation])
        }
    }
}
