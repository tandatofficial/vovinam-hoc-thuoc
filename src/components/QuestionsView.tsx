import React, { useState, useMemo } from 'react';
import { QuestionData, QuestionStatus } from '../data/questions';

interface QuestionsViewProps {
  questions: QuestionData[];
  onPracticeSingle: (id: number, subMode?: 'overview' | 'chunk' | 'cloze' | 'checklist') => void;
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({
  questions,
  onPracticeSingle,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | QuestionStatus>('all');
  const [expandedId, setExpandedId] = useState<number | null>(1); // Open first question by default

  const counts = useMemo(() => {
    return {
      all: questions.length,
      review: questions.filter((q) => q.status === 'review').length,
      learning: questions.filter((q) => q.status === 'learning').length,
      mastered: questions.filter((q) => q.status === 'mastered').length,
      unlearned: questions.filter((q) => q.status === 'unlearned').length,
    };
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return questions.filter((item) => {
      // Filter status
      const matchesStatus = activeFilter === 'all' || item.status === activeFilter;

      // Filter query
      const matchesQuery =
        !q ||
        item.number.toString() === q ||
        `câu ${item.number}` === q ||
        item.title.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [questions, searchQuery, activeFilter]);

  const toggleAccordion = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getStatusBadge = (status: QuestionStatus) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="font-label-sm text-label-sm uppercase tracking-wide px-2 py-0.5 rounded-full bg-surface-container text-score-remembered font-bold border border-score-remembered/20">
            Vững
          </span>
        );
      case 'learning':
        return (
          <span className="font-label-sm text-label-sm uppercase tracking-wide px-2 py-0.5 rounded-full bg-secondary-fixed text-status-reviewing font-bold border border-secondary/20">
            Đang ôn
          </span>
        );
      case 'review':
        return (
          <span className="font-label-sm text-label-sm uppercase tracking-wide px-2 py-0.5 rounded-full bg-score-forgot/10 text-score-forgot font-bold border border-score-forgot/30">
            Cần ôn gấp
          </span>
        );
      default:
        return (
          <span className="font-label-sm text-label-sm uppercase tracking-wide px-2 py-0.5 rounded-full bg-surface-subtle text-on-surface-variant">
            Chưa học
          </span>
        );
    }
  };

  const getNumberBadgeClass = (status: QuestionStatus) => {
    switch (status) {
      case 'mastered':
        return 'bg-score-remembered text-on-primary';
      case 'learning':
        return 'bg-score-partial text-on-surface';
      case 'review':
        return 'bg-score-forgot text-on-primary';
      default:
        return 'bg-surface-subtle text-on-surface-variant border border-border-subtle';
    }
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Header Info */}
      <div className="mb-4">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
          Ngân Hàng 10 Câu Hỏi
        </h1>
        <p className="font-body-md text-body-md text-outline">
          Toàn bộ lý thuyết võ đạo Lam đai đệ tam cấp
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-3">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm theo số câu, từ khóa, chủ đề..."
          className="w-full h-11 pl-10 pr-10 rounded-xl bg-surface-card border border-border-subtle focus:outline-none focus:border-primary text-body-md text-on-surface transition-all placeholder:text-outline"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Filter Tabs Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-label-md font-label-md transition-all ${
            activeFilter === 'all'
              ? 'bg-primary text-on-primary font-bold shadow-xs'
              : 'bg-surface-card text-on-surface-variant hover:bg-surface-subtle border border-border-subtle'
          }`}
        >
          Tất cả 10 ({counts.all})
        </button>

        <button
          onClick={() => setActiveFilter('review')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-label-md font-label-md transition-all flex items-center gap-1 ${
            activeFilter === 'review'
              ? 'bg-score-forgot text-white font-bold shadow-xs'
              : 'bg-surface-card text-score-forgot hover:bg-surface-subtle border border-score-forgot/30'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">warning</span>
          <span>Yếu điểm ({counts.review})</span>
        </button>

        <button
          onClick={() => setActiveFilter('learning')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-label-md font-label-md transition-all flex items-center gap-1 ${
            activeFilter === 'learning'
              ? 'bg-score-partial text-on-surface font-bold shadow-xs'
              : 'bg-surface-card text-on-surface-variant hover:bg-surface-subtle border border-border-subtle'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">autorenew</span>
          <span>Đang ôn ({counts.learning})</span>
        </button>

        <button
          onClick={() => setActiveFilter('mastered')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-label-md font-label-md transition-all flex items-center gap-1 ${
            activeFilter === 'mastered'
              ? 'bg-score-remembered text-white font-bold shadow-xs'
              : 'bg-surface-card text-score-remembered hover:bg-surface-subtle border border-border-subtle'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          <span>Đã vững ({counts.mastered})</span>
        </button>
      </div>

      {/* Questions Accordion List */}
      <section className="flex flex-col gap-3">
        {filteredQuestions.map((q) => {
          const isOpen = expandedId === q.id;

          return (
            <article
              key={q.id}
              className={`bg-surface-card rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-primary/50 shadow-sm ring-1 ring-primary/20'
                  : 'border-border-subtle hover:border-outline'
              }`}
            >
              <header
                onClick={() => toggleAccordion(q.id)}
                className="p-space-md flex items-start gap-3 cursor-pointer select-none"
              >
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-headline-md text-headline-md ${getNumberBadgeClass(
                    q.status
                  )}`}
                >
                  {q.number}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    {getStatusBadge(q.status)}
                    <span
                      className={`material-symbols-outlined text-outline transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </div>
                  <h2 className="font-body-lg-bold text-body-lg-bold text-on-surface line-clamp-2">
                    {q.title}
                  </h2>
                </div>
              </header>

              {isOpen && (
                <div className="px-space-md pb-space-md flex flex-col gap-3 pt-1 border-t border-border-subtle animate-in fade-in duration-200">
                  {/* Detailed Visual & Memory breakdown */}
                  <div className="rounded-xl overflow-hidden bg-surface-subtle p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-secondary font-label-md text-label-md">
                      <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                      <span>{q.easyAnswer.mnemonic}</span>
                    </div>

                    {/* Question 1 Colors & Shapes Diagram */}
                    {q.visualDetails?.fourColors && (
                      <div className="grid grid-cols-2 gap-2 text-on-surface-variant font-body-md text-body-md">
                        {q.visualDetails.fourColors.map((c, i) => (
                          <div key={i} className="p-2 rounded bg-surface-card flex items-center gap-2 shadow-xs">
                            <span className={`w-3.5 h-3.5 rounded-full ${c.colorClass} flex-shrink-0`} />
                            <span className="text-xs">
                              <strong>{c.name}:</strong> {c.meaning}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {q.visualDetails?.threeShapes && (
                      <div className="p-2.5 rounded-lg bg-surface-card font-body-md text-body-md text-on-surface flex flex-col gap-1 shadow-xs">
                        <div className="font-body-lg-bold text-body-lg-bold text-primary">3 Nét hình khối:</div>
                        {q.visualDetails.threeShapes.map((s, i) => (
                          <p key={i} className="text-xs leading-relaxed">
                            {i + 1}. <strong>{s.name}:</strong> {s.meaning}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Question 2 Objectives */}
                    {q.visualDetails?.threeObjectives && (
                      <div className="flex flex-col gap-1 pt-1">
                        {q.visualDetails.threeObjectives.map((obj, i) => (
                          <div key={i} className="p-2 rounded bg-surface-card text-xs flex flex-col shadow-xs">
                            <strong className="text-primary">{obj.name}</strong>
                            <span className="text-outline">{obj.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Core Answer Excerpt */}
                    <p className="font-body-md text-body-md text-on-surface pt-1 leading-relaxed">
                      {q.easyAnswer.coreMeaning}
                    </p>
                  </div>

                  {/* 4 Feature Learning Launchers */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <button
                      onClick={() => onPracticeSingle(q.id, 'chunk')}
                      className="p-2 rounded-xl bg-surface-subtle hover:bg-surface-container text-primary font-label-sm text-label-sm font-bold flex items-center justify-center gap-1 transition-colors"
                      title="Học từng đoạn"
                    >
                      <span className="material-symbols-outlined text-[16px]">view_carousel</span>
                      <span>Từng đoạn</span>
                    </button>
                    <button
                      onClick={() => onPracticeSingle(q.id, 'cloze')}
                      className="p-2 rounded-xl bg-surface-subtle hover:bg-surface-container text-secondary font-label-sm text-label-sm font-bold flex items-center justify-center gap-1 transition-colors"
                      title="Điền từ còn thiếu"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit_note</span>
                      <span>Điền từ</span>
                    </button>
                    <button
                      onClick={() => onPracticeSingle(q.id, 'checklist')}
                      className="p-2 rounded-xl bg-surface-subtle hover:bg-surface-container text-status-mastered font-label-sm text-label-sm font-bold flex items-center justify-center gap-1 transition-colors"
                      title="Checklist ý chính"
                    >
                      <span className="material-symbols-outlined text-[16px]">checklist_rtl</span>
                      <span>Checklist</span>
                    </button>
                  </div>

                  {/* Primary Action Button */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onPracticeSingle(q.id, 'overview')}
                      className="w-full h-10 px-4 rounded-xl bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                      <span>Vào học toàn diện câu này</span>
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* Empty State */}
      {filteredQuestions.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-card rounded-2xl shadow-sm border border-border-subtle mt-4">
          <div className="w-14 h-14 rounded-full bg-surface-subtle flex items-center justify-center text-outline mb-3">
            <span className="material-symbols-outlined text-[28px]">search_off</span>
          </div>
          <div className="font-headline-md text-headline-md text-on-surface mb-1">
            Không tìm thấy câu hỏi
          </div>
          <p className="font-body-md text-body-md text-outline max-w-xs mb-4">
            Thử nhập từ khóa khác hoặc chuyển bộ lọc sang mục [Tất cả 10].
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md active:scale-95 transition-transform"
          >
            Xem toàn bộ 10 câu
          </button>
        </div>
      )}
    </div>
  );
};
