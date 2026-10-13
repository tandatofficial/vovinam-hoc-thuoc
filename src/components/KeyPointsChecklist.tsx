import React, { useState, useEffect } from 'react';
import { QuestionData } from '../data/questions';

interface KeyPointsChecklistProps {
  question: QuestionData;
  onAllCompleted?: () => void;
}

export const KeyPointsChecklist: React.FC<KeyPointsChecklistProps> = ({
  question,
  onAllCompleted,
}) => {
  const points = question.keyPoints && question.keyPoints.length > 0
    ? question.keyPoints
    : (question.fullAnswer.bulletPoints?.map((b) => `${b.label}: ${b.text}`) || [
        question.easyAnswer.coreMeaning,
        question.easyAnswer.mnemonic,
      ]);

  const storageKey = `vovinam_keypoints_q${question.id}`;
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  const [isBlindTest, setIsBlindTest] = useState<boolean>(false);

  // Sync when question changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`vovinam_keypoints_q${question.id}`);
      if (saved) {
        setCheckedItems(JSON.parse(saved));
        return;
      }
    } catch {
      // ignore
    }
    setCheckedItems({});
  }, [question.id]);

  const handleToggle = (index: number) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [index]: !prev[index] };
      try {
        localStorage.setItem(`vovinam_keypoints_q${question.id}`, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleCheckAll = () => {
    const allChecked: Record<number, boolean> = {};
    points.forEach((_, idx) => {
      allChecked[idx] = true;
    });
    setCheckedItems(allChecked);
    try {
      localStorage.setItem(`vovinam_keypoints_q${question.id}`, JSON.stringify(allChecked));
    } catch {
      // ignore
    }
    onAllCompleted?.();
  };

  const handleReset = () => {
    setCheckedItems({});
    try {
      localStorage.removeItem(`vovinam_keypoints_q${question.id}`);
    } catch {
      // ignore
    }
  };

  const checkedCount = points.filter((_, idx) => !!checkedItems[idx]).length;
  const totalCount = points.length;
  const percent = Math.round((checkedCount / totalCount) * 100);
  const is100Percent = checkedCount === totalCount && totalCount > 0;

  return (
    <div className="flex flex-col gap-space-md bg-surface-card rounded-2xl p-space-md border border-border-subtle shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-space-xs border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">checklist_rtl</span>
          <div>
            <h3 className="font-body-lg-bold text-body-lg-bold text-on-surface">Checklist ý chính cốt tử</h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Tích chọn từng ý khi tự nhẩm • Tuyệt đối không bỏ sót ý
            </p>
          </div>
        </div>
        <span
          className={`font-label-md text-label-md font-bold px-2.5 py-1 rounded-full transition-colors ${
            is100Percent
              ? 'bg-status-mastered text-on-primary'
              : 'bg-primary/10 text-primary'
          }`}
        >
          {checkedCount}/{totalCount} ý ({percent}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-1">
        <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              is100Percent ? 'bg-status-mastered' : 'bg-primary'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-label-sm text-on-surface-variant font-medium pt-0.5">
          <span>{is100Percent ? '🎉 Đầy đủ 100% luận điểm thi vấn đáp!' : `Cần nhớ thêm ${totalCount - checkedCount} ý nữa`}</span>
          <button
            onClick={() => setIsBlindTest(!isBlindTest)}
            className="text-primary hover:underline flex items-center gap-0.5"
          >
            <span className="material-symbols-outlined text-[14px]">
              {isBlindTest ? 'visibility' : 'visibility_off'}
            </span>
            <span>{isBlindTest ? 'Hiện nội dung gợi ý' : 'Che ý để tự vấn đáp'}</span>
          </button>
        </div>
      </div>

      {/* Keypoints list */}
      <div className="flex flex-col gap-2.5">
        {points.map((point, index) => {
          const isDone = !!checkedItems[index];
          return (
            <div
              key={index}
              onClick={() => handleToggle(index)}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
                isDone
                  ? 'bg-status-mastered/10 border-status-mastered/40 text-on-surface'
                  : 'bg-surface-subtle border-border-subtle hover:border-primary/40'
              }`}
            >
              {/* Custom Checkbox */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isDone
                    ? 'bg-status-mastered text-on-primary shadow-xs'
                    : 'border-2 border-outline-variant bg-surface-card'
                }`}
              >
                {isDone && <span className="material-symbols-outlined text-[16px] font-bold">check</span>}
              </div>

              {/* Point content */}
              <div className="flex-1 min-w-0">
                <span className="font-label-sm text-label-sm font-bold uppercase text-primary mr-1.5">
                  Ý {index + 1}:
                </span>
                {isBlindTest && !isDone ? (
                  <span className="italic text-on-surface-variant/70 font-medium">
                    [Chạm vào ô khi bạn nhẩm trúng ý này]
                  </span>
                ) : (
                  <span
                    className={`font-body-md text-body-md leading-relaxed ${
                      isDone ? 'font-semibold text-on-surface line-through opacity-85' : 'font-medium text-on-surface'
                    }`}
                  >
                    {point}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 100% congratulation banner */}
      {is100Percent && (
        <div className="p-3 bg-gradient-to-r from-status-mastered/15 to-secondary/15 border border-status-mastered/40 rounded-xl flex items-center gap-2 text-status-mastered animate-pulse">
          <span className="material-symbols-outlined text-[24px]">verified</span>
          <p className="font-body-md text-body-md font-bold text-on-surface">
            Chúc mừng! Bạn đã nắm trọn vẹn toàn bộ các ý cốt tử của câu này.
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-label-md font-semibold text-on-surface-variant hover:text-score-forgot transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          <span>Bỏ chọn hết</span>
        </button>

        <button
          onClick={handleCheckAll}
          className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-label-md text-label-md font-bold transition-all flex items-center gap-1 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">done_all</span>
          <span>Đánh dấu thuộc hết</span>
        </button>
      </div>
    </div>
  );
};
