import React, { useState, useEffect } from 'react';
import { QuestionData, ClozeItem } from '../data/questions';

interface FillBlanksProps {
  question: QuestionData;
}

export const FillBlanks: React.FC<FillBlanksProps> = ({ question }) => {
  const clozeList: ClozeItem[] = question.clozeData && question.clozeData.length > 0
    ? question.clozeData
    : [
        {
          prompt: question.easyAnswer.headlineQuote.replace(/[“”"]/g, ''),
          answers: [question.hintWords.split(' ')[0] || 'Vovinam'],
          distractors: ['Võ học', 'Tổ quốc', 'Môn phái']
        }
      ];

  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const currentItem = clozeList[activeItemIndex] || clozeList[0];

  // User input slots: record index -> string
  const [userInputs, setUserInputs] = useState<Record<number, string>>({});
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [shuffledWordBank, setShuffledWordBank] = useState<string[]>([]);

  // Prepare word bank when item changes
  useEffect(() => {
    setUserInputs({});
    setActiveSlot(0);
    setIsChecked(false);
    setIsRevealed(false);

    const pool = [...currentItem.answers, ...(currentItem.distractors || [])];
    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    setShuffledWordBank(pool);
  }, [currentItem, activeItemIndex]);

  const handlePickWord = (word: string) => {
    if (isChecked) return;
    setUserInputs((prev) => ({
      ...prev,
      [activeSlot]: word,
    }));
    // Auto focus next empty slot
    const totalSlots = currentItem.answers.length;
    for (let i = 0; i < totalSlots; i++) {
      if (i !== activeSlot && !userInputs[i]) {
        setActiveSlot(i);
        return;
      }
    }
  };

  const handleClearSlot = (slotIdx: number) => {
    if (isChecked) return;
    setUserInputs((prev) => {
      const copy = { ...prev };
      delete copy[slotIdx];
      return copy;
    });
    setActiveSlot(slotIdx);
  };

  const isAllFilled = currentItem.answers.every((_, idx) => !!userInputs[idx]);

  const isCorrect = currentItem.answers.every((ans, idx) => {
    const input = (userInputs[idx] || '').trim().toLowerCase();
    const correct = ans.trim().toLowerCase();
    return input === correct;
  });

  // Render parts of the prompt
  const renderPromptWithSlots = () => {
    // Regex splits by {0}, {1}, etc.
    const parts = currentItem.prompt.split(/(\{\d+\})/g);

    return parts.map((part, index) => {
      const match = part.match(/^\{(\d+)\}$/);
      if (match) {
        const slotIdx = parseInt(match[1], 10);
        const filledWord = userInputs[slotIdx];
        const correctAnswer = currentItem.answers[slotIdx];
        const isSlotActive = activeSlot === slotIdx;
        const isSlotCorrect = filledWord?.trim().toLowerCase() === correctAnswer?.trim().toLowerCase();

        let borderClass = 'border-primary/50 bg-primary/5 text-primary';
        if (isSlotActive) borderClass = 'border-primary bg-primary/10 ring-2 ring-primary/30';
        if (isChecked || isRevealed) {
          borderClass = isSlotCorrect || isRevealed
            ? 'border-status-mastered bg-status-mastered/10 text-status-mastered font-bold'
            : 'border-score-forgot bg-score-forgot/10 text-score-forgot font-bold animate-shake';
        }

        return (
          <button
            key={index}
            type="button"
            onClick={() => {
              if (filledWord && !isChecked) {
                handleClearSlot(slotIdx);
              } else {
                setActiveSlot(slotIdx);
              }
            }}
            className={`inline-flex items-center justify-center min-w-[70px] px-2.5 py-1 mx-1 rounded-lg border-2 font-bold text-body-md transition-all cursor-pointer ${borderClass}`}
          >
            {isRevealed ? (
              <span>{correctAnswer}</span>
            ) : filledWord ? (
              <span className="flex items-center gap-1">
                {filledWord}
                {!isChecked && (
                  <span className="material-symbols-outlined text-[14px] opacity-60">close</span>
                )}
              </span>
            ) : (
              <span className="opacity-40 italic font-normal text-label-sm">
                [{slotIdx + 1}] Chạm điền
              </span>
            )}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col gap-space-md bg-surface-card rounded-2xl p-space-md border border-border-subtle shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-space-xs border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">edit_note</span>
          <div>
            <h3 className="font-body-lg-bold text-body-lg-bold text-on-surface">Điền từ còn thiếu</h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Luyện thuộc lòng chuẩn từng từ nguyên văn
            </p>
          </div>
        </div>
        <span className="font-label-md text-label-md font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
          Thử thách {activeItemIndex + 1}/{clozeList.length}
        </span>
      </div>

      {/* Main Cloze Sentence Area */}
      <div className="bg-surface-subtle rounded-xl p-space-md border border-border-subtle min-h-[120px] flex flex-col justify-center">
        <p className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant mb-2">
          Đọc và điền vào chỗ trống:
        </p>
        <div className="font-body-lg text-body-lg text-on-surface leading-loose font-medium">
          {renderPromptWithSlots()}
        </div>
      </div>

      {/* Word Bank */}
      {!isChecked && !isRevealed && (
        <div className="flex flex-col gap-2">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">touch_app</span>
            Chạm vào từ bên dưới để điền vào ô [{activeSlot + 1}]:
          </span>
          <div className="flex flex-wrap gap-2">
            {shuffledWordBank.map((word, idx) => {
              const isUsed = Object.values(userInputs).includes(word);
              return (
                <button
                  key={idx}
                  disabled={isUsed}
                  onClick={() => handlePickWord(word)}
                  className={`px-3.5 py-2 rounded-xl text-body-md font-bold transition-all active:scale-95 shadow-xs ${
                    isUsed
                      ? 'bg-surface-subtle text-on-surface-variant/40 border border-border-subtle/50 cursor-not-allowed'
                      : 'bg-surface-card border-2 border-primary/30 text-primary hover:bg-primary hover:text-on-primary'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Result feedback alert */}
      {isChecked && (
        <div
          className={`p-space-sm rounded-xl flex items-center justify-between border ${
            isCorrect
              ? 'bg-status-mastered/10 border-status-mastered/30 text-status-mastered'
              : 'bg-score-forgot/10 border-score-forgot/30 text-score-forgot'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">
              {isCorrect ? 'check_circle' : 'error'}
            </span>
            <span className="font-body-lg-bold text-body-lg-bold">
              {isCorrect ? 'Chính xác 100%! Thuộc chuẩn nguyên văn.' : 'Chưa chuẩn nguyên văn! Hãy xem lại các ô đỏ.'}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-border-subtle gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsRevealed(true);
              setIsChecked(true);
            }}
            className="px-3 py-2 text-label-md font-semibold text-on-surface-variant hover:text-primary rounded-lg transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">lightbulb</span>
            <span>Hiện đáp án</span>
          </button>

          {(isChecked || isRevealed) && (
            <button
              onClick={() => {
                setUserInputs({});
                setActiveSlot(0);
                setIsChecked(false);
                setIsRevealed(false);
              }}
              className="px-3 py-2 text-label-md font-semibold text-secondary hover:underline rounded-lg transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">replay</span>
              <span>Làm lại</span>
            </button>
          )}
        </div>

        <div>
          {!isChecked && !isRevealed ? (
            <button
              disabled={!isAllFilled}
              onClick={() => setIsChecked(true)}
              className={`px-5 py-2.5 rounded-xl font-headline-md text-headline-md flex items-center gap-1.5 transition-all shadow-xs ${
                isAllFilled
                  ? 'bg-primary text-on-primary hover:brightness-105 active:scale-95'
                  : 'bg-surface-subtle text-on-surface-variant/50 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">check</span>
              <span>Kiểm tra</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (activeItemIndex < clozeList.length - 1) {
                  setActiveItemIndex(activeItemIndex + 1);
                } else {
                  setActiveItemIndex(0);
                }
              }}
              className="px-5 py-2.5 rounded-xl font-headline-md text-headline-md bg-primary text-on-primary hover:brightness-105 active:scale-95 transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>{activeItemIndex < clozeList.length - 1 ? 'Câu điền tiếp theo' : 'Ôn lại từ đầu'}</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
