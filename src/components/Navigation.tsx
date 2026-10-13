import React from 'react';

export type TabType = 'trang-chu' | 'hoc-bai' | '10-cau-hoi' | 'so-tay' | 'thi-thu';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  mistakeCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab, mistakeCount = 0 }) => {
  const navItems: { id: TabType; label: string; icon: string; badge?: number }[] = [
    { id: 'trang-chu', label: 'Trang chủ', icon: 'home' },
    { id: 'hoc-bai', label: 'Học bài', icon: 'style' },
    { id: '10-cau-hoi', label: '10 Câu hỏi', icon: 'format_list_bulleted' },
    { id: 'so-tay', label: 'Sổ tay lỗi', icon: 'menu_book', badge: mistakeCount > 0 ? mistakeCount : undefined },
    { id: 'thi-thu', label: 'Thi thử', icon: 'timer' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-surface-card/90 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.05)] border-t border-border-subtle">
      <div className="flex justify-around items-center h-16 max-w-[640px] mx-auto px-space-xs">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all active:scale-95 ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[24px] transition-transform ${
                    isActive ? 'scale-110' : ''
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2.5 bg-score-forgot text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`font-label-sm text-[11px] mt-0.5 tracking-tight truncate ${isActive ? 'font-bold text-primary' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
