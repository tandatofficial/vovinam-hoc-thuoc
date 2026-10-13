import React from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDay: number;
  streakDays: number;
  daysRemaining: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentDay,
  streakDays,
  daysRemaining,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-150">
      <div className="w-full max-w-[440px] bg-surface-card rounded-2xl shadow-xl p-space-md flex flex-col gap-4 border border-border-subtle">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Hồ Sơ Võ Sinh</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-subtle text-on-surface-variant flex items-center justify-center hover:bg-surface-dim"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center gap-3.5 shadow-md">
          <div className="w-14 h-14 rounded-full bg-surface-card/20 border-2 border-white/40 flex items-center justify-center text-on-primary shrink-0">
            <span className="material-symbols-outlined text-[32px]">sports_martial_arts</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs uppercase tracking-wider text-primary-fixed opacity-90 font-bold">
              Cấp đai dự sát hạch
            </span>
            <span className="font-headline-md text-headline-md leading-tight">
              Lam đai đệ tam cấp (Võ 3)
            </span>
            <span className="text-xs text-primary-fixed mt-0.5">
              Môn phái Vovinam Việt Võ Đạo
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-secondary text-[22px] mb-1">
              local_fire_department
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">{streakDays} ngày</span>
            <span className="text-xs text-on-surface-variant font-medium">Chuỗi rèn luyện</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-score-forgot text-[22px] mb-1">
              hourglass_top
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">Còn {daysRemaining} ngày</span>
            <span className="text-xs text-on-surface-variant font-medium">Đến ngày sát hạch</span>
          </div>
        </div>

        {/* Martial Motto */}
        <div className="p-3 rounded-xl bg-surface-container text-primary flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">verified</span>
          <div className="text-xs leading-relaxed">
            <strong>Tâm niệm:</strong> “Bàn tay thép đặt lên trái tim từ ái. Võ thuật để tự vệ, tu dưỡng đạo đức và phụng sự dân tộc.”
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors"
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
};
