import React from 'react';
import { TabType } from './Navigation';

interface HeaderProps {
  currentTab: TabType;
  currentDay: number;
  onOpenResetModal: () => void;
  onOpenProfileModal: () => void;
  onSelectDay?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  currentDay,
  onOpenResetModal,
  onOpenProfileModal,
}) => {
  const tabTitles: Record<TabType, string> = {
    'trang-chu': 'Trang Chủ',
    'hoc-bai': 'Học Bài',
    '10-cau-hoi': '10 Câu Hỏi',
    'so-tay': 'Sổ Tay Lỗi Sai',
    'thi-thu': 'Thi Thử',
  };

  const logoUrl =
    'https://lh3.googleusercontent.com/aida/AEtjO1WW6kLC31ais5ih9fsg56sPHm0KcXFQIGfXM5KsTiaw1YcqHEuu-oOap8Yrk30NrWwG3pzXGEJDwAOI_AGGeU-RFl9qdUggoNl1XCjrcFjysD7Pc-Us9Na9dBBtEi1ObnmqnOJe6Js9i5sw4KG-mWPoBIX6k92fUuwd51w5aY8yyxO5u30j8hMQHJpwAx-BBz4XCV23K8OsefcGpidA3Zz6f-sA3fvKEKqCfLfOo-2M5SSHx_QK9ePdug';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-surface-card/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-border-subtle">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between max-w-4xl mx-auto w-full">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-space-sm select-none">
          <img
            alt="Vovinam Logo"
            className="h-8 w-auto object-contain"
            src={logoUrl}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-primary leading-tight">
              Võ 3 — 10 Ngày
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              {tabTitles[currentTab] || 'Vovinam'}
            </span>
          </div>
        </div>

        {/* Right: Day Badge & Quick Action Triggers */}
        <div className="flex items-center gap-space-sm">
          {/* Day Counter Pill */}
          <button
            onClick={onOpenProfileModal}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim active:scale-95 transition-all"
            title="Xem kế hoạch ngày"
          >
            <span className="material-symbols-outlined text-[14px] text-secondary">
              calendar_today
            </span>
            <span className="font-label-sm text-label-sm font-bold">
              Ngày {currentDay}/10
            </span>
          </button>

          {/* Reset / Settings Button */}
          <button
            aria-label="Cài đặt & Đặt lại"
            onClick={onOpenResetModal}
            className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-subtle active:scale-95 transition-transform"
            title="Cài đặt & Đặt lại lộ trình"
          >
            <span className="material-symbols-outlined text-[22px]">restart_alt</span>
          </button>

          {/* Profile Trigger */}
          <button
            onClick={onOpenProfileModal}
            aria-label="Thông tin võ sinh"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary hover:bg-primary-container active:scale-95 transition-transform shadow-sm"
            title="Hồ sơ võ sinh Lam đai"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
