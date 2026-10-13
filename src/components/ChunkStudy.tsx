import React, { useState, useEffect } from 'react';
import { QuestionData } from '../data/questions';
import { vnSpeech } from '../utils/tts';

interface ChunkStudyProps {
  question: QuestionData;
  onChunkLearned?: () => void;
}

export const ChunkStudy: React.FC<ChunkStudyProps> = ({ question }) => {
  const chunks = question.chunks && question.chunks.length > 0 
    ? question.chunks 
    : question.fullAnswer.paragraphs;

  const [activeChunkIndex, setActiveChunkIndex] = useState<number>(0);
  const [isMasked, setIsMasked] = useState<boolean>(false);
  const [cumulativeMode, setCumulativeMode] = useState<boolean>(false);
  const [learnedChunks, setLearnedChunks] = useState<Record<number, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    return vnSpeech.addListener((speaking) => setIsSpeaking(speaking));
  }, []);

  const currentChunk = chunks[activeChunkIndex] || chunks[0];
  const totalChunks = chunks.length;
  const progressPercent = Math.round(((Object.keys(learnedChunks).length) / totalChunks) * 100);

  const handleSpeak = (text: string) => {
    vnSpeech.toggle(text);
  };

  const handleToggleLearned = (index: number) => {
    setLearnedChunks((prev) => {
      const next = { ...prev, [index]: !prev[index] };
      return next;
    });
    // Auto advance if marking as learned
    if (!learnedChunks[index] && activeChunkIndex < totalChunks - 1) {
      setActiveChunkIndex(activeChunkIndex + 1);
      setIsMasked(false);
    }
  };

  // Build cumulative text if cumulativeMode is active
  const displayedText = cumulativeMode
    ? chunks.slice(0, activeChunkIndex + 1).map((c, i) => `[Đoạn ${i + 1}] ${c}`).join('\n\n')
    : currentChunk;

  return (
    <div className="flex flex-col gap-space-md bg-surface-card rounded-2xl p-space-md border border-border-subtle shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-space-xs border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">view_carousel</span>
          <div>
            <h3 className="font-body-lg-bold text-body-lg-bold text-on-surface">Học từng đoạn câu dài</h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Chia nhỏ để dễ thuộc • Học cuốn chiếu
            </p>
          </div>
        </div>
        <span className="font-label-md text-label-md font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          {Object.keys(learnedChunks).length}/{totalChunks} đoạn
        </span>
      </div>

      {/* Progress Bar & Stepper Tabs */}
      <div className="flex flex-col gap-1.5">
        <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {chunks.map((_, idx) => {
            const isCurrent = activeChunkIndex === idx;
            const isDone = learnedChunks[idx];
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveChunkIndex(idx);
                  setIsMasked(false);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-label-md font-bold transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-primary text-on-primary shadow-xs'
                    : isDone
                    ? 'bg-status-mastered/15 text-status-mastered border border-status-mastered/30'
                    : 'bg-surface-subtle text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {isDone ? (
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                ) : (
                  <span className="text-[12px] opacity-75">#{idx + 1}</span>
                )}
                <span>Đoạn {idx + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Chunk Display Card */}
      <div className="relative bg-gradient-to-br from-surface-subtle to-surface-card rounded-xl p-space-md border border-border-subtle flex flex-col gap-3 min-h-[140px] justify-between">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-label-sm font-bold uppercase text-primary tracking-wide">
            <span className="material-symbols-outlined text-[16px]">format_quote</span>
            {cumulativeMode ? `Đoạn 1 đến Đoạn ${activeChunkIndex + 1} (Nối đoạn)` : `Đoạn ${activeChunkIndex + 1} / ${totalChunks}`}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleSpeak(displayedText)}
              className={`p-1.5 rounded-full transition-colors ${
                isSpeaking ? 'bg-primary text-on-primary animate-pulse' : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              title="Nghe đọc đoạn này"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isSpeaking ? 'stop_circle' : 'volume_up'}
              </span>
            </button>
            <button
              onClick={() => setIsMasked(!isMasked)}
              className={`p-1.5 rounded-full transition-colors ${
                isMasked ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              title={isMasked ? 'Hiện chữ' : 'Che chữ để tự nhẩm'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isMasked ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
        </div>

        {/* Text Content */}
        <div className="py-2">
          {isMasked ? (
            <div className="p-4 bg-surface-card rounded-lg border border-dashed border-outline flex flex-col items-center justify-center text-center gap-2 cursor-pointer" onClick={() => setIsMasked(false)}>
              <span className="material-symbols-outlined text-[28px] text-secondary">psychology</span>
              <p className="font-body-md text-body-md font-medium text-on-surface-variant">
                Đang che chữ để bạn tự nhẩm lại trong đầu...
              </p>
              <span className="text-label-sm text-primary font-bold">Chạm để kiểm tra đáp án</span>
            </div>
          ) : (
            <div className="font-body-lg text-body-lg text-on-surface leading-relaxed whitespace-pre-line font-medium">
              {displayedText}
            </div>
          )}
        </div>

        {/* Action Controls for this chunk */}
        <div className="flex items-center justify-between pt-2 border-t border-border-subtle/60 gap-2">
          <button
            onClick={() => setCumulativeMode(!cumulativeMode)}
            className={`text-label-sm font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
              cumulativeMode
                ? 'bg-secondary/15 text-secondary border border-secondary/30'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">link</span>
            <span>{cumulativeMode ? 'Đang nối đoạn' : 'Nối các đoạn đã học'}</span>
          </button>

          <button
            onClick={() => handleToggleLearned(activeChunkIndex)}
            className={`px-4 py-2 rounded-xl text-label-md font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
              learnedChunks[activeChunkIndex]
                ? 'bg-status-mastered text-on-primary'
                : 'bg-primary text-on-primary hover:brightness-105'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {learnedChunks[activeChunkIndex] ? 'check' : 'check_circle'}
            </span>
            <span>{learnedChunks[activeChunkIndex] ? 'Đã thuộc đoạn này' : 'Đánh dấu đã thuộc'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Prev/Next chunk */}
      <div className="flex items-center justify-between">
        <button
          disabled={activeChunkIndex === 0}
          onClick={() => {
            setActiveChunkIndex(Math.max(0, activeChunkIndex - 1));
            setIsMasked(false);
          }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-label-md font-medium transition-colors ${
            activeChunkIndex === 0
              ? 'opacity-40 cursor-not-allowed text-on-surface-variant'
              : 'text-primary hover:bg-surface-subtle'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          <span>Đoạn trước</span>
        </button>

        <button
          disabled={activeChunkIndex === totalChunks - 1}
          onClick={() => {
            setActiveChunkIndex(Math.min(totalChunks - 1, activeChunkIndex + 1));
            setIsMasked(false);
          }}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-label-md font-medium transition-colors ${
            activeChunkIndex === totalChunks - 1
              ? 'opacity-40 cursor-not-allowed text-on-surface-variant'
              : 'text-primary hover:bg-surface-subtle'
          }`}
        >
          <span>Đoạn tiếp theo</span>
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};
