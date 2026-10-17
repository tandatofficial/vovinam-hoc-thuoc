/**
 * Bộ điều khiển phát âm thanh chuyên nghiệp cho Vovinam Học Thuộc (Bản Web & Desktop)
 * Hỗ trợ:
 * 1. Phát trực tiếp file âm thanh người thật 100% (Edge-TTS NamMinhNeural: q{id}.mp3 & q{id}_full.mp3)
 * 2. Tua đoạn mượt mà (Scrubber, seek, tua lùi/tới 5s)
 * 3. Chỉnh tốc độ phát theo cấp số cộng 0.25x (0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 1.75x, 2.0x)
 * 4. Fallback tự động sang Web Speech Synthesis tiếng Việt khi mất file
 */

export const SPEED_STEPS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0] as const;
export type SpeedStep = (typeof SPEED_STEPS)[number];

export interface AudioPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  currentTrackId: string | null;
  label: string;
}

type AudioStateListener = (state: AudioPlayerState) => void;

class WebAudioService {
  private audio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private state: AudioPlayerState = {
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1.0,
    currentTrackId: null,
    label: '',
  };

  private listeners: Set<AudioStateListener> = new Set();
  private timeUpdateInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Restore saved rate if any
      const savedRate = localStorage.getItem('vovinam_audio_rate');
      if (savedRate) {
        const parsed = parseFloat(savedRate);
        if (SPEED_STEPS.includes(parsed as SpeedStep)) {
          this.state.playbackRate = parsed;
        }
      }
    }
  }

  public getState(): AudioPlayerState {
    return { ...this.state };
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    const currentState = this.getState();
    this.listeners.forEach((cb) => cb(currentState));
  }

  private startTimeTracker() {
    this.stopTimeTracker();
    this.timeUpdateInterval = window.setInterval(() => {
      if (this.audio && !this.state.isPaused && this.state.isPlaying) {
        this.state.currentTime = this.audio.currentTime;
        this.state.duration = this.audio.duration || 0;
        this.emit();
      }
    }, 100);
  }

  private stopTimeTracker() {
    if (this.timeUpdateInterval !== null) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
  }

  public stop() {
    this.stopTimeTracker();
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = '';
      this.audio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }

    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.currentTime = 0;
    this.state.currentTrackId = null;
    this.emit();
  }

  public pause() {
    if (this.audio && this.state.isPlaying) {
      this.audio.pause();
      this.state.isPlaying = false;
      this.state.isPaused = true;
      this.emit();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      this.state.isPlaying = false;
      this.state.isPaused = true;
      this.emit();
    }
  }

  public resume() {
    if (this.audio && this.state.isPaused) {
      this.audio.play().then(() => {
        this.state.isPlaying = true;
        this.state.isPaused = false;
        this.startTimeTracker();
        this.emit();
      }).catch(() => {});
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.state.isPlaying = true;
      this.state.isPaused = false;
      this.emit();
    }
  }

  public seek(seconds: number) {
    if (this.audio && this.state.duration > 0) {
      const clamped = Math.max(0, Math.min(this.state.duration, seconds));
      this.audio.currentTime = clamped;
      this.state.currentTime = clamped;
      this.emit();
    }
  }

  public skip(seconds: number) {
    if (this.audio) {
      this.seek(this.audio.currentTime + seconds);
    }
  }

  public setSpeed(rate: number) {
    const clamped = Math.max(0.5, Math.min(2.0, rate));
    this.state.playbackRate = clamped;
    try {
      localStorage.setItem('vovinam_audio_rate', clamped.toString());
    } catch {}

    if (this.audio) {
      this.audio.playbackRate = clamped;
    }
    this.emit();
  }

  public increaseSpeed() {
    const curr = this.state.playbackRate;
    const next = SPEED_STEPS.find((s) => s > curr + 0.01) ?? 2.0;
    this.setSpeed(next);
  }

  public decreaseSpeed() {
    const curr = this.state.playbackRate;
    const prev = [...SPEED_STEPS].reverse().find((s) => s < curr - 0.01) ?? 0.5;
    this.setSpeed(prev);
  }

  public playTrack(trackId: string, audioUrl: string, fallbackText: string, label: string = '') {
    // If the exact same track is playing, toggle pause
    if (this.state.currentTrackId === trackId) {
      if (this.state.isPlaying) {
        this.pause();
      } else if (this.state.isPaused) {
        this.resume();
      } else {
        this.stop();
      }
      return;
    }

    this.stop();

    this.state.currentTrackId = trackId;
    this.state.label = label;
    this.state.isPlaying = true;
    this.state.isPaused = false;
    this.state.currentTime = 0;
    this.state.duration = 0;
    this.emit();

    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = audioUrl;
    this.audio = audio;
    audio.playbackRate = this.state.playbackRate;

    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        this.state.duration = audio.duration;
        this.emit();
      }
    };

    audio.onloadedmetadata = updateDuration;
    audio.ondurationchange = updateDuration;
    audio.oncanplay = updateDuration;

    audio.onended = () => {
      this.stop();
    };

    let hasTriedAlt = false;
    audio.onerror = () => {
      if (!hasTriedAlt) {
        hasTriedAlt = true;
        const altUrl = audioUrl.startsWith('/') ? '.' + audioUrl : '/' + audioUrl.replace(/^\.\//, '');
        console.info(`[WebAudioService] Thử đường dẫn audio thay thế: ${altUrl}`);
        audio.src = altUrl;
        audio.load();
        audio.play().then(() => {
          this.startTimeTracker();
        }).catch((err) => {
          console.warn('[WebAudioService] Không thể phát audio thay thế:', err);
          this.fallbackTTS(fallbackText);
        });
        return;
      }
      console.warn(`[WebAudioService] File ${audioUrl} không phát được, fallback sang Web Speech Synthesis`);
      this.fallbackTTS(fallbackText);
    };

    audio.play().then(() => {
      this.startTimeTracker();
    }).catch((err) => {
      console.warn('[WebAudioService] audio.play() rejected:', err);
      // Try alt or fallback
      if (!hasTriedAlt) {
        hasTriedAlt = true;
        const altUrl = audioUrl.startsWith('/') ? '.' + audioUrl : '/' + audioUrl.replace(/^\.\//, '');
        audio.src = altUrl;
        audio.load();
        audio.play().then(() => {
          this.startTimeTracker();
        }).catch(() => {
          this.fallbackTTS(fallbackText);
        });
      } else {
        this.fallbackTTS(fallbackText);
      }
    });
  }

  private fallbackTTS(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) {
      this.stop();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = Math.max(0.6, Math.min(1.4, this.state.playbackRate * 0.9));

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find((v) => v.lang.toLowerCase().includes('vi'));
    if (viVoice) utterance.voice = viVoice;

    utterance.onend = () => {
      this.stop();
    };
    utterance.onerror = () => {
      this.stop();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  // Legacy compatibility helpers
  public addListener(cb: (speaking: boolean) => void) {
    return this.subscribe((s) => cb(s.isPlaying));
  }

  public toggle(text: string, audioUrl?: string) {
    if (this.state.isPlaying) {
      this.stop();
    } else if (audioUrl) {
      this.playTrack(audioUrl, audioUrl, text);
    } else {
      this.playTrack('custom-tts', '', text);
    }
  }
}

export const webAudio = new WebAudioService();
export const vnSpeech = webAudio; // compatibility alias
export type VoiceSpeed = number;
