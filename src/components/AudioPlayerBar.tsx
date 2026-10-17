import React, { useEffect, useState } from 'react';
import { webAudio, AudioPlayerState } from '../utils/tts';

interface AudioPlayerBarProps {
  questionNumber: number;
  isFull?: boolean;
  textToSpeak: string;
  labelText?: string;
  buttonText?: string;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  questionNumber,
  isFull = false,
  textToSpeak,
  labelText = 'Giọng đọc Tiếng Việt (Người thật 100%)',
  buttonText,
}) => {
  const [audioState, setAudioState] = useState<AudioPlayerState>(webAudio.getState());
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragValue, setDragValue] = useState<number>(0);

  useEffect(() => {
    return webAudio.subscribe((newState) => {
      setAudioState(newState);
    });
  }, []);

  const trackId = isFull ? `q${questionNumber}_full` : `q${questionNumber}`;
  const audioUrl = `/audio/${trackId}.mp3`;
  const isThisTrackActive = audioState.currentTrackId === trackId;

  const formatTime = (time: number): string => {
    const total = Math.max(0, Math.floor(time || 0));
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPlay = () => {
    webAudio.playTrack(trackId, audioUrl, textToSpeak, labelText);
  };

  const handleTogglePlayPause = () => {
    if (audioState.isPlaying) {
      webAudio.pause();
    } else if (audioState.isPaused) {
      webAudio.resume();
    } else {
      handleStartPlay();
    }
  };

  return (
    <div className="flex flex-col gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle shadow-xs transition-all">
      {/* Header: Title, Status, and 0.25x Step Speed Stepper */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`material-symbols-outlined text-[20px] transition-colors ${
              isThisTrackActive && audioState.isPlaying
                ? 'text-status-mastered animate-pulse'
                : 'text-primary'
            }`}
          >
            {isThisTrackActive && audioState.isPlaying ? 'graphic_eq' : 'record_voice_over'}
          </span>
          <span className="font-bold text-xs sm:text-sm text-on-surface truncate">
            {isThisTrackActive && audioState.isPlaying
              ? 'Đang phát giọng đọc...'
              : isThisTrackActive && audioState.isPaused
              ? 'Đang tạm dừng'
              : labelText}
          </span>
        </div>

        {/* Speed Controls: [-] 1.00x [+] */}
        <div className="flex items-center gap-1 bg-surface-card p-1 rounded-xl border border-border-subtle shrink-0">
          <button
            type="button"
            onClick={() => webAudio.decreaseSpeed()}
            disabled={audioState.playbackRate <= 0.5}
            className="w-6 h-6 rounded-lg bg-surface-subtle hover:bg-surface-card active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center font-bold text-xs text-on-surface"
            title="Giảm 0.25x tốc độ"
          >
            −
          </button>
          <span className="text-[11px] font-mono font-bold text-primary px-1.5 min-w-[42px] text-center">
            {audioState.playbackRate.toFixed(2)}x
          </span>
          <button
            type="button"
            onClick={() => webAudio.increaseSpeed()}
            disabled={audioState.playbackRate >= 2.0}
            className="w-6 h-6 rounded-lg bg-surface-subtle hover:bg-surface-card active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center font-bold text-xs text-on-surface"
            title="Tăng 0.25x tốc độ"
          >
            +
          </button>
        </div>
      </div>

      {/* Active Track Controls: Scrubber & Seek Buttons */}
      {isThisTrackActive && (audioState.isPlaying || audioState.isPaused) ? (
        <div className="flex flex-col gap-2 pt-1 border-t border-border-subtle/70">
          {/* Scrubber slider */}
          <div className="flex flex-col gap-1">
            <input
              type="range"
              min={0}
              max={Math.max(audioState.duration || 1, 1)}
              step={0.1}
              value={isDragging ? dragValue : audioState.currentTime}
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
              onChange={(e) => setDragValue(parseFloat(e.target.value))}
              onMouseUp={() => {
                setIsDragging(false);
                webAudio.seek(dragValue);
              }}
              onTouchEnd={() => {
                setIsDragging(false);
                webAudio.seek(dragValue);
              }}
              className="w-full h-1.5 bg-surface-card rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant font-medium">
              <span>{formatTime(isDragging ? dragValue : audioState.currentTime)}</span>
              <span>{formatTime(audioState.duration)}</span>
            </div>
          </div>

          {/* Quick jump controls: -5s | Play/Pause | +5s | Stop */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => webAudio.skip(-5)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-card hover:bg-surface-subtle border border-border-subtle text-on-surface text-xs font-bold transition-all active:scale-95"
                title="Tua lùi 5 giây"
              >
                <span className="material-symbols-outlined text-[16px]">replay_5</span>
                <span>-5s</span>
              </button>

              <button
                type="button"
                onClick={handleTogglePlayPause}
                className="w-9 h-9 rounded-full bg-primary text-on-primary hover:brightness-105 shadow-sm flex items-center justify-center transition-all active:scale-95"
                title={audioState.isPlaying ? 'Tạm dừng' : 'Tiếp tục phát'}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {audioState.isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => webAudio.skip(5)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-surface-card hover:bg-surface-subtle border border-border-subtle text-on-surface text-xs font-bold transition-all active:scale-95"
                title="Tua tới 5 giây"
              >
                <span>+5s</span>
                <span className="material-symbols-outlined text-[16px]">forward_5</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => webAudio.stop()}
              className="w-8 h-8 rounded-full bg-score-forgot/10 text-score-forgot hover:bg-score-forgot hover:text-white transition-all active:scale-95 flex items-center justify-center"
              title="Dừng hẳn bài nghe"
            >
              <span className="material-symbols-outlined text-[18px]">stop</span>
            </button>
          </div>
        </div>
      ) : (
        /* Idle Large Action Button */
        <button
          type="button"
          onClick={handleStartPlay}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 transition-all active:scale-98 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">play_circle</span>
          <span>
            {buttonText || (isFull ? 'Nghe đọc toàn bộ nguyên văn chi tiết' : 'Nghe đọc mẫu câu hỏi & ý cốt tử')}
          </span>
        </button>
      )}
    </div>
  );
};
