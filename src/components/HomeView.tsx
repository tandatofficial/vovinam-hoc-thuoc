import React from 'react';
import { QuestionData, TEN_DAY_PLAN } from '../data/questions';

interface HomeViewProps {
  questions: QuestionData[];
  currentDay: number;
  streakDays: number;
  daysRemaining: number;
  onStartStudy: (targetQuestionId?: number, subMode?: 'overview' | 'chunk' | 'cloze' | 'checklist') => void;
  onStartExam: () => void;
  onSelectDay: (day: number) => void;
  onOpenMistakes?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  questions,
  currentDay,
  streakDays,
  daysRemaining,
  onStartStudy,
  onStartExam,
  onSelectDay,
  onOpenMistakes,
}) => {
  // Compute real-time stats
  const masteredCount = questions.filter((q) => q.status === 'mastered').length;
  const learningCount = questions.filter((q) => q.status === 'learning').length;
  const reviewCount = questions.filter((q) => q.status === 'review').length;
  const masteredPercent = Math.round((masteredCount / questions.length) * 100);
  const mistakeCount = questions.filter(
    (q) => q.score === 0 || q.score === 1 || q.isBookmarked
  ).length;

  const heroSpiritPhoto =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCzi7glUrs69BCXpxs97D0TYsEiOiijvKkYJuI5cguII_YUTQdIQwmwdWSbedOay_42jKe7k8EFQ5TlAmPXh3qz-TN_zW9zorE-PjlGHzjXYsgBqdal_E65pyQtyoygciCxChOHjyocgC4QxVfFIIdEpX1x6WewPu_YQsFq-v3YnSyRGyXtsCY-PNQVC0MOkOjhQPckXIDFRWxBpVpreFUj7-zsX9IEBnQ0qLOSYl_k1jbF2jIz7Xax';

  return (
    <div className="flex flex-col w-full gap-space-md pb-8">
      {/* Dynamic Greeting & Martial Spirit Mini Banner */}
      <div className="flex items-center justify-between bg-surface-container px-space-md py-space-sm rounded-xl">
        <div className="flex items-center gap-space-sm min-w-0">
          <span
            className="material-symbols-outlined text-primary text-[22px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            military_tech
          </span>
          <p className="font-body-md text-body-md text-on-surface truncate">
            Võ sinh: <span className="font-body-lg-bold text-primary">Lam đai đệ tam cấp</span>
          </p>
        </div>
        <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary bg-secondary-fixed px-2 py-0.5 rounded-full shrink-0">
          <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
          Chuỗi {streakDays} ngày
        </span>
      </div>

      {/* Hero Progress Card: Overview & Countdown */}
      <div className="bg-surface-card rounded-xl p-space-md shadow-sm border border-border-subtle flex flex-col gap-space-md">
        {/* Top Meta Row */}
        <div className="flex items-start justify-between gap-space-sm">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              Lộ trình sát hạch
            </span>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary flex items-center gap-1.5 mt-0.5">
              Hôm nay: Ngày {currentDay}/10
            </h1>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-error-container text-on-error-container">
            <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
            <span className="font-label-md text-label-md">Còn {daysRemaining} ngày</span>
          </div>
        </div>

        {/* Mastered Ring / Visual Stats Segment */}
        <div className="bg-surface-subtle rounded-lg p-space-md flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-body-lg-bold text-body-lg-bold text-on-surface">Tiến độ thuộc bài</span>
              <span className="font-label-sm text-label-sm bg-status-mastered text-on-primary px-2 py-0.5 rounded-full font-bold">
                {masteredPercent}%
              </span>
            </div>
            <span className="font-label-md text-label-md text-primary font-bold">
              {masteredCount} / {questions.length} câu vững
            </span>
          </div>

          {/* Segmented Bar (10 segments) */}
          <div className="grid grid-cols-10 gap-1 w-full h-2.5">
            {questions.map((q) => {
              let color = 'bg-outline-variant/50';
              if (q.status === 'mastered') color = 'bg-score-remembered';
              else if (q.status === 'learning') color = 'bg-score-partial';
              else if (q.status === 'review') color = 'bg-score-forgot';

              return (
                <div
                  key={q.id}
                  className={`${color} rounded-full transition-colors cursor-pointer`}
                  title={`Câu ${q.id}: ${q.title} (${q.status})`}
                  onClick={() => onStartStudy(q.id)}
                />
              );
            })}
          </div>

          {/* Detail status breakdown */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-surface-card rounded p-1.5 flex flex-col items-center shadow-xs">
              <span className="font-label-sm text-label-sm text-score-remembered flex items-center gap-0.5 font-bold">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> Đã vững
              </span>
              <span className="font-headline-md text-headline-md text-on-surface">{masteredCount} câu</span>
            </div>
            <div className="bg-surface-card rounded p-1.5 flex flex-col items-center shadow-xs">
              <span className="font-label-sm text-label-sm text-score-partial flex items-center gap-0.5 font-bold">
                <span className="material-symbols-outlined text-[14px]">autorenew</span> Đang ôn
              </span>
              <span className="font-headline-md text-headline-md text-on-surface">{learningCount} câu</span>
            </div>
            <div className="bg-surface-card rounded p-1.5 flex flex-col items-center shadow-xs">
              <span className="font-label-sm text-label-sm text-score-forgot flex items-center gap-0.5 font-bold">
                <span className="material-symbols-outlined text-[14px]">warning</span> Yếu điểm
              </span>
              <span className="font-headline-md text-headline-md text-on-surface">{reviewCount} câu</span>
            </div>
          </div>
        </div>

        {/* Target Badge */}
        <div className="flex items-center gap-space-sm bg-surface-container-high px-space-sm py-2 rounded-lg">
          <span className="material-symbols-outlined text-primary text-[20px] shrink-0">track_changes</span>
          <p className="font-label-md text-label-md text-on-surface truncate">
            <strong className="text-primary">Mục tiêu:</strong> Học câu 5–6 &amp; Khắc phục câu 1–4
          </p>
        </div>
      </div>

      {/* 4 Super Study Methods Bar */}
      <div className="bg-surface-card rounded-xl p-space-md shadow-sm border border-border-subtle flex flex-col gap-2">
        <span className="font-label-sm text-label-sm uppercase font-bold text-primary tracking-wider flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">stars</span>
          4 Phương pháp luyện nhớ chuyên sâu
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onStartStudy(5, 'chunk')}
            className="p-2.5 rounded-xl bg-surface-subtle hover:bg-surface-container border border-border-subtle flex items-center gap-2 text-left transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-[22px]">view_carousel</span>
            <div className="min-w-0">
              <span className="font-label-md text-label-md font-bold text-on-surface block">Học từng đoạn</span>
              <span className="text-[11px] text-on-surface-variant block truncate">Thuộc câu dài dễ hơn</span>
            </div>
          </button>

          <button
            onClick={() => onStartStudy(5, 'cloze')}
            className="p-2.5 rounded-xl bg-surface-subtle hover:bg-surface-container border border-border-subtle flex items-center gap-2 text-left transition-colors"
          >
            <span className="material-symbols-outlined text-secondary text-[22px]">edit_note</span>
            <div className="min-w-0">
              <span className="font-label-md text-label-md font-bold text-on-surface block">Điền từ khuyết</span>
              <span className="text-[11px] text-on-surface-variant block truncate">Thuộc chuẩn nguyên văn</span>
            </div>
          </button>

          <button
            onClick={() => onStartStudy(5, 'checklist')}
            className="p-2.5 rounded-xl bg-surface-subtle hover:bg-surface-container border border-border-subtle flex items-center gap-2 text-left transition-colors"
          >
            <span className="material-symbols-outlined text-status-mastered text-[22px]">checklist_rtl</span>
            <div className="min-w-0">
              <span className="font-label-md text-label-md font-bold text-on-surface block">Checklist ý</span>
              <span className="text-[11px] text-on-surface-variant block truncate">Không bỏ sót ý nào</span>
            </div>
          </button>

          <button
            onClick={onOpenMistakes}
            className="p-2.5 rounded-xl bg-score-forgot/5 hover:bg-score-forgot/10 border border-score-forgot/30 flex items-center gap-2 text-left transition-colors"
          >
            <span className="material-symbols-outlined text-score-forgot text-[22px]">menu_book</span>
            <div className="min-w-0">
              <span className="font-label-md text-label-md font-bold text-score-forgot block">Sổ tay lỗi sai</span>
              <span className="text-[11px] text-on-surface-variant block truncate">{mistakeCount} câu cần ôn</span>
            </div>
          </button>
        </div>
      </div>

      {/* Today's Action Card (Primary Mission) */}
      <div className="bg-surface-card rounded-xl p-space-md shadow-sm border border-border-subtle flex flex-col gap-space-md">
        {/* Header of Card */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold">
            <span
              className="material-symbols-outlined text-[15px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              flag
            </span>
            Nhiệm vụ Ngày {currentDay}
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[15px]">schedule</span> 20–25 phút
          </span>
        </div>

        {/* Content breakdown */}
        <div className="flex flex-col gap-space-xs">
          <div
            onClick={() => onStartStudy(5)}
            className="flex items-start gap-space-sm bg-surface-subtle p-space-sm rounded-lg cursor-pointer hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-[20px] mt-0.5 shrink-0">menu_book</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-primary uppercase font-bold">Bài mới hôm nay</span>
              <span className="font-body-lg-bold text-body-lg-bold text-on-surface">Câu 5 &amp; Câu 6</span>
              <span className="font-body-md text-body-md text-on-surface-variant line-clamp-1">
                Điều tâm niệm thứ 6 &amp; ý nghĩa võ đạo
              </span>
            </div>
          </div>

          <div
            onClick={() => onStartStudy(4)}
            className="flex items-start gap-space-sm bg-surface-subtle p-space-sm rounded-lg cursor-pointer hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-score-partial text-[20px] mt-0.5 shrink-0">replay</span>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-score-partial uppercase font-bold">Ôn củng cố</span>
              <span className="font-body-md text-body-md text-on-surface">
                Câu 1 (Ý nghĩa phù hiệu) và Câu 4 (Năm tôn chỉ)
              </span>
            </div>
          </div>
        </div>

        {/* Dual Actions */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={() => onStartStudy(5)}
            className="w-full min-h-[52px] bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md hover:brightness-105"
          >
            <span>Bắt đầu học hôm nay</span>
            <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
          </button>
          <button
            onClick={onStartExam}
            className="w-full min-h-[48px] bg-surface-container text-primary rounded-xl font-body-lg-bold text-body-lg-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[20px]">timer</span>
            <span>Thi thử ngay (3 phút)</span>
          </button>
        </div>
      </div>

      {/* Study Tip / Martial Arts Insight Banner */}
      <div className="bg-secondary-fixed text-on-secondary-fixed rounded-xl p-space-md flex items-start gap-space-sm shadow-sm border border-secondary/20">
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-on-secondary shrink-0 mt-0.5 shadow-sm">
          <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
            Mẹo võ sinh Vovinam
          </span>
          <p className="font-body-md text-body-md mt-0.5 leading-snug">
            Nhớ <strong className="text-secondary font-bold">tự đọc câu hỏi và nói to thành tiếng</strong> dõng dạc trước khi bấm lật đáp án! Khẩu khí vững, tâm trí mới vững.
          </p>
        </div>
      </div>

      {/* Visual Spirit Break (Photo Banner) */}
      <div className="relative w-full h-32 rounded-xl overflow-hidden shadow-sm bg-surface-container">
        <img
          src={heroSpiritPhoto}
          alt="Young Vietnamese martial artists practicing kicks outdoors at sunrise"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent flex items-end p-space-md">
          <p className="text-on-primary font-headline-md text-headline-md tracking-tight">
            “Bàn tay thép đặt lên trái tim từ ái”
          </p>
        </div>
      </div>

      {/* 10-Day Road Map Section */}
      <div className="bg-surface-card rounded-xl p-space-md shadow-sm border border-border-subtle flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">alt_route</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Lộ trình 10 ngày</h2>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Kế hoạch chi tiết</span>
        </div>

        {/* Timeline List */}
        <div className="flex flex-col gap-2 relative">
          {TEN_DAY_PLAN.map((plan) => {
            const isCompleted = plan.day < currentDay;
            const isToday = plan.day === currentDay;

            if (isToday) {
              return (
                <div
                  key={plan.day}
                  onClick={() => onSelectDay(plan.day)}
                  className="p-space-sm rounded-xl bg-primary-fixed border-2 border-primary shadow-xs flex flex-col gap-1 cursor-pointer transition-transform hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">radio_button_checked</span>
                      {plan.label} (Đang học)
                    </span>
                    <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-primary text-on-primary font-bold">
                      Hôm nay
                    </span>
                  </div>
                  <h3 className="font-body-lg-bold text-body-lg-bold text-on-surface">{plan.focus}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{plan.description}</p>
                </div>
              );
            }

            return (
              <div
                key={plan.day}
                onClick={() => onSelectDay(plan.day)}
                className={`p-space-sm rounded-lg flex items-center justify-between border cursor-pointer transition-colors ${
                  isCompleted
                    ? 'bg-surface-card border-border-subtle opacity-75 hover:opacity-100'
                    : 'bg-surface-subtle border-border-subtle/50 hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-space-sm min-w-0">
                  <span
                    className={`material-symbols-outlined text-[20px] shrink-0 ${
                      isCompleted ? 'text-status-mastered' : 'text-on-surface-variant'
                    }`}
                  >
                    {isCompleted ? 'check_circle' : 'circle'}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-label-md font-semibold text-on-surface truncate">
                      {plan.label}
                    </span>
                    <span className="font-body-md text-body-md text-on-surface-variant truncate">
                      {plan.focus}
                    </span>
                  </div>
                </div>

                <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
