import React from 'react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: number;
  onSetCurrentDay: (day: number) => void;
  onResetProgress: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  currentDay,
  onSetCurrentDay,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-150">
      <div className="w-full max-w-[440px] bg-surface-card rounded-2xl shadow-xl p-space-md flex flex-col gap-4 border border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Cài Đặt &amp; Lộ Trình</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-subtle text-on-surface-variant flex items-center justify-center hover:bg-surface-dim"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Change Day Slider / Select */}
        <div className="bg-surface-subtle p-3.5 rounded-xl flex flex-col gap-2 border border-border-subtle">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface font-bold">
              Chọn ngày đang học:
            </span>
            <span className="font-body-lg-bold text-primary font-bold">
              Ngày {currentDay} / 10
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                onClick={() => onSetCurrentDay(d)}
                className={`py-2 rounded-lg font-label-md text-label-md transition-all ${
                  d === currentDay
                    ? 'bg-primary text-white font-bold shadow-xs'
                    : 'bg-surface-card text-on-surface-variant hover:bg-surface-container border border-border-subtle'
                }`}
              >
                N.{d}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Progress Action */}
        <div className="bg-error-container/40 p-3.5 rounded-xl flex flex-col gap-2 border border-error/20">
          <span className="font-label-md text-label-md text-score-forgot font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Đặt lại dữ liệu học tập
          </span>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Khôi phục trạng thái tiến độ 10 câu về ban đầu (3 câu vững, 2 câu đang ôn, 1 câu yếu điểm).
          </p>
          <button
            onClick={() => {
              onResetProgress();
              onClose();
            }}
            className="mt-1 w-full py-2.5 rounded-lg bg-score-forgot text-white font-label-md text-label-md active:scale-95 transition-transform hover:brightness-105 shadow-xs"
          >
            Xác nhận đặt lại tiến độ
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-surface-subtle text-on-surface font-label-md text-label-md hover:bg-surface-dim transition-colors"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
