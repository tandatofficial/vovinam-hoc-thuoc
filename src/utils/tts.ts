/**
 * Bộ điều khiển phát giọng đọc Tiếng Việt chuẩn cho Vovinam Học Thuộc
 * Hỗ trợ:
 * 1. Giọng online tự nhiên chuẩn Việt Nam (Google TTS HD)
 * 2. Giọng offline native iOS Siri/Linh (SpeechSynthesis vi-VN)
 * 3. Tự động chia nhỏ câu văn dài để phát mượt mà không bị ngắt quãng
 * 4. Tùy chỉnh tốc độ: 0.8x (Chậm học thuộc), 1.0x (Chuẩn), 1.2x (Nhanh)
 */

export type VoiceSpeed = 0.8 | 1.0 | 1.2;
export type VoiceEngine = 'auto' | 'natural' | 'system';

class VietnameseSpeechService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPlaying: boolean = false;
  private speed: VoiceSpeed = 0.95 as unknown as VoiceSpeed;
  private engine: VoiceEngine = 'auto';
  private onStateChangeListeners: Set<(speaking: boolean) => void> = new Set();
  private systemVoices: SpeechSynthesisVoice[] = [];
  private audioQueue: string[] = [];
  private currentQueueIndex: number = 0;

  constructor() {
    this.initSystemVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.initSystemVoices();
      };
    }
  }

  private initSystemVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.systemVoices = window.speechSynthesis.getVoices();
    }
  }

  public getSystemVietnameseVoice(): SpeechSynthesisVoice | null {
    this.initSystemVoices();
    // Ưu tiên voice vi-VN (Linh trên iOS hoặc Google Tiếng Việt)
    const exactVi = this.systemVoices.find(
      (v) => v.lang === 'vi-VN' || v.lang === 'vi_VN'
    );
    if (exactVi) return exactVi;

    // Tìm bất kỳ voice nào có chứa vi
    const viAny = this.systemVoices.find(
      (v) => v.lang.toLowerCase().startsWith('vi') || v.name.toLowerCase().includes('vietnam')
    );
    return viAny || null;
  }

  public addListener(listener: (speaking: boolean) => void) {
    this.onStateChangeListeners.add(listener);
    listener(this.isPlaying);
    return () => {
      this.onStateChangeListeners.delete(listener);
    };
  }

  private notify(speaking: boolean) {
    this.isPlaying = speaking;
    this.onStateChangeListeners.forEach((cb) => cb(speaking));
  }

  public setSpeed(newSpeed: VoiceSpeed) {
    this.speed = newSpeed;
  }

  public getSpeed(): VoiceSpeed {
    return this.speed;
  }

  public setEngine(newEngine: VoiceEngine) {
    this.engine = newEngine;
  }

  public getEngine(): VoiceEngine {
    return this.engine;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public stop() {
    // Dừng audio HTML5
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.src = '';
      this.currentAudio = null;
    }
    this.audioQueue = [];
    this.currentQueueIndex = 0;

    // Dừng Web Speech API
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }

    this.notify(false);
  }

  /**
   * Tách câu văn bản thành các phân đoạn ngắn tối đa 150 ký tự
   * phù hợp với URL TTS và ngắt nghỉ tự nhiên.
   */
  private splitTextIntoChunks(text: string): string[] {
    // Làm sạch ký tự lạ, giữ nguyên dấu câu
    const clean = text
      .replace(/[\r\n]+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) return [];

    // Tách theo dấu chấm, phẩy, hai chấm, chấm phẩy
    const rawSegments = clean.split(/(?<=[.!?;:\n])\s+/);
    const chunks: string[] = [];

    for (const seg of rawSegments) {
      const trimmed = seg.trim();
      if (!trimmed) continue;

      if (trimmed.length <= 150) {
        chunks.push(trimmed);
      } else {
        // Tách thêm theo dấu phẩy hoặc khoảng trắng
        const subParts = trimmed.split(/,\s*/);
        let temp = '';
        for (const part of subParts) {
          if ((temp + ', ' + part).length <= 150) {
            temp = temp ? `${temp}, ${part}` : part;
          } else {
            if (temp) chunks.push(temp);
            temp = part;
          }
        }
        if (temp) chunks.push(temp);
      }
    }

    return chunks.length > 0 ? chunks : [clean];
  }

  /**
   * Đọc bằng giọng Online Google Tiếng Việt chất lượng cao
   */
  private playOnlineQueue(chunks: string[], onDone: () => void, onError: () => void) {
    this.audioQueue = chunks;
    this.currentQueueIndex = 0;

    const playNext = () => {
      if (this.currentQueueIndex >= this.audioQueue.length) {
        this.stop();
        onDone();
        return;
      }

      const chunkText = this.audioQueue[this.currentQueueIndex];
      this.currentQueueIndex++;

      const encoded = encodeURIComponent(chunkText);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encoded}`;

      const audio = new Audio();
      this.currentAudio = audio;
      audio.playbackRate = this.speed;

      audio.onended = () => {
        // Nghỉ một nhịp ngắn 180ms giữa các câu để tạo cảm giác tự nhiên
        setTimeout(() => {
          if (this.isPlaying) {
            playNext();
          }
        }, 180);
      };

      audio.onerror = () => {
        console.warn('Online TTS chunk error, falling back to next or system');
        onError();
      };

      audio.play().catch((err) => {
        console.warn('Audio play prevented or offline:', err);
        onError();
      });
    };

    playNext();
  }

  /**
   * Đọc bằng Web Speech API hệ thống (iOS Siri Linh vi-VN)
   */
  private playSystemVoice(text: string, onDone: () => void, onError: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onError();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const viVoice = this.getSystemVietnameseVoice();
    if (viVoice) {
      utterance.voice = viVoice;
    }
    utterance.lang = 'vi-VN';
    utterance.rate = this.speed;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      this.currentUtterance = null;
      this.notify(false);
      onDone();
    };

    utterance.onerror = (e) => {
      console.warn('System TTS error:', e);
      this.currentUtterance = null;
      this.notify(false);
      onError();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Phát văn bản tiếng Việt
   */
  public speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!text || !text.trim()) {
        resolve();
        return;
      }

      // Nếu đang nói thì dừng lại
      this.stop();
      this.notify(true);

      const chunks = this.splitTextIntoChunks(text);

      const trySystem = () => {
        this.playSystemVoice(
          text,
          () => resolve(),
          () => {
            this.stop();
            resolve();
          }
        );
      };

      if (this.engine === 'system') {
        trySystem();
        return;
      }

      // Chế độ 'auto' hoặc 'natural': Ưu tiên giọng Online tự nhiên, nếu offline fallback về System
      this.playOnlineQueue(
        chunks,
        () => resolve(),
        () => {
          // Fallback sang native system voice nếu mất mạng hoặc lỗi stream
          trySystem();
        }
      );
    });
  }

  /**
   * Phát file âm thanh đã clone (VieNeu-TTS), nếu chưa có file thì tự động đọc qua TTS
   */
  public playAudioOrSpeak(audioUrl?: string, fallbackText: string = ''): Promise<void> {
    return new Promise((resolve) => {
      if (this.isPlaying) {
        this.stop();
        resolve();
        return;
      }

      if (audioUrl) {
        this.stop();
        this.notify(true);

        const audio = new Audio(audioUrl);
        this.currentAudio = audio;
        audio.playbackRate = this.speed;

        audio.onended = () => {
          this.stop();
          resolve();
        };

        audio.onerror = () => {
          // File cloned chưa có hoặc 404, fallback mượt mà sang TTS
          console.info(`Audio track ${audioUrl} not found, falling back to dynamic TTS.`);
          this.speak(fallbackText).then(resolve);
        };

        audio.play().catch(() => {
          this.speak(fallbackText).then(resolve);
        });
        return;
      }

      this.speak(fallbackText).then(resolve);
    });
  }

  /**
   * Bật/Tắt phát nhanh
   */
  public toggle(text: string, audioUrl?: string): void {
    if (this.isPlaying) {
      this.stop();
    } else {
      if (audioUrl) {
        this.playAudioOrSpeak(audioUrl, text);
      } else {
        this.speak(text);
      }
    }
  }
}

export const vnSpeech = new VietnameseSpeechService();
