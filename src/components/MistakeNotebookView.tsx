import React, { useState } from 'react';
import { QuestionData } from '../data/questions';

interface MistakeNotebookViewProps {
  questions: QuestionData[];
  onPracticeQuestion: (id: number, subMode?: 'chunk' | 'cloze' | 'checklist') => void;
  onUpdateQuestionScore: (id: number, score: number) => void;
  onToggleBookmark: (id: number) => void;
  onUpdateUserNote: (id: number, note: string) => void;
}

export const MistakeNotebookView: React.FC<MistakeNotebookViewProps> = ({
  questions,
  onPracticeQuestion,
  onUpdateQuestionScore,
  onToggleBookmark,
  onUpdateUserNote,
}) => {
  const [filter, setFilter] = useState<'all' | 'forgot' | 'partial' | 'bookmarked'>('all');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>('');

  // Mistake candidates: score === 0 OR score === 1 OR isBookmarked === true
  const mistakeQuestions = questions.filter((q) => {
    const isWeak = q.score === 0 || q.score === 1 || q.status === 'review' || q.status === 'learning';
    if (filter === 'forgot') return q.score === 0;
    if (filter === 'partial') return q.score === 1;
    if (filter === 'bookmarked') return !!q.isBookmarked;
    return isWeak || !!q.isBookmarked;
  });

  const totalForgot = questions.filter((q) => q.score === 0).length;
  const totalPartial = questions.filter((q) => q.score === 1).length;
  const totalBookmarked = questions.filter((q) => !!q.isBookmarked).length;

  const handleStartEditNote = (q: QuestionData) => {
    setEditingNoteId(q.id);
    setNoteDraft(q.userNote || '');
  };

  const handleSaveNote = (id: number) => {
    onUpdateUserNote(id, noteDraft);
    setEditingNoteId(null);
  };

  return (
    <div className="flex flex-col w-full gap-space-md pb-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-score-forgot/10 via-surface-card to-surface-card rounded-2xl p-space-md border border-score-forgot/30 shadow-sm flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-score-forgot/15 text-score-forgot flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">menu_book</span>
            </div>
            <div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                Sổ tay lỗi sai &amp; Hay quên
              </h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Lọc riêng các câu yếu điểm • Tập trung khắc phục trước ngày thi
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-score-forgot text-on-primary font-bold text-label-md shrink-0">
            {mistakeQuestions.length} câu cần ôn
          </span>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <button
            onClick={() => setFilter('forgot')}
            className={`p-2 rounded-xl border flex flex-col items-center transition-all ${
              filter === 'forgot'
                ? 'bg-score-forgot/15 border-score-forgot shadow-xs'
                : 'bg-surface-subtle border-border-subtle hover:bg-surface-container'
            }`}
          >
            <span className="font-label-sm text-label-sm text-score-forgot font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">cancel</span> Quên hẳn
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">{totalForgot} câu</span>
          </button>

          <button
            onClick={() => setFilter('partial')}
            className={`p-2 rounded-xl border flex flex-col items-center transition-all ${
              filter === 'partial'
                ? 'bg-score-partial/15 border-score-partial shadow-xs'
                : 'bg-surface-subtle border-border-subtle hover:bg-surface-container'
            }`}
          >
            <span className="font-label-sm text-label-sm text-score-partial font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">autorenew</span> Mơ hồ
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">{totalPartial} câu</span>
          </button>

          <button
            onClick={() => setFilter('bookmarked')}
            className={`p-2 rounded-xl border flex flex-col items-center transition-all ${
              filter === 'bookmarked'
                ? 'bg-secondary/15 border-secondary shadow-xs'
                : 'bg-surface-subtle border-border-subtle hover:bg-surface-container'
            }`}
          >
            <span className="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bookmark</span> Đã ghim
            </span>
            <span className="font-headline-md text-headline-md text-on-surface">{totalBookmarked} câu</span>
          </button>
        </div>

        {/* CTA Launch Practice All Mistakes */}
        {mistakeQuestions.length > 0 && (
          <button
            onClick={() => onPracticeQuestion(mistakeQuestions[0].id)}
            className="w-full mt-1 min-h-[46px] bg-score-forgot text-on-primary rounded-xl font-headline-md text-headline-md flex items-center justify-center gap-2 hover:brightness-105 active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[20px]">bolt</span>
            <span>Khắc phục cấp tốc ngay ({mistakeQuestions.length} câu)</span>
          </button>
        )}
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-label-md font-semibold transition-all shrink-0 ${
            filter === 'all'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-card text-on-surface-variant border border-border-subtle hover:bg-surface-subtle'
          }`}
        >
          Tất cả ({totalForgot + totalPartial + totalBookmarked})
        </button>
        <button
          onClick={() => setFilter('forgot')}
          className={`px-3 py-1.5 rounded-full text-label-md font-semibold transition-all shrink-0 ${
            filter === 'forgot'
              ? 'bg-score-forgot text-on-primary'
              : 'bg-surface-card text-on-surface-variant border border-border-subtle hover:bg-surface-subtle'
          }`}
        >
          Quên hoàn toàn ({totalForgot})
        </button>
        <button
          onClick={() => setFilter('partial')}
          className={`px-3 py-1.5 rounded-full text-label-md font-semibold transition-all shrink-0 ${
            filter === 'partial'
              ? 'bg-score-partial text-on-surface'
              : 'bg-surface-card text-on-surface-variant border border-border-subtle hover:bg-surface-subtle'
          }`}
        >
          Nhớ mang máng ({totalPartial})
        </button>
        <button
          onClick={() => setFilter('bookmarked')}
          className={`px-3 py-1.5 rounded-full text-label-md font-semibold transition-all shrink-0 ${
            filter === 'bookmarked'
              ? 'bg-secondary text-on-secondary'
              : 'bg-surface-card text-on-surface-variant border border-border-subtle hover:bg-surface-subtle'
          }`}
        >
          Đã ghim ({totalBookmarked})
        </button>
      </div>

      {/* Questions List */}
      {mistakeQuestions.length === 0 ? (
        <div className="bg-surface-card rounded-2xl p-space-xl border border-border-subtle text-center flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-status-mastered/15 text-status-mastered flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]">verified</span>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Không có câu nào trong mục này!</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-[360px]">
              Tất cả các câu hỏi thuộc danh mục này đã được bạn nắm vững hoặc chưa có ghi chú nào bị ghim.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-space-md">
          {mistakeQuestions.map((q) => {
            const isForgot = q.score === 0;
            return (
              <div
                key={q.id}
                className="bg-surface-card rounded-2xl p-space-md border border-border-subtle shadow-xs flex flex-col gap-space-sm hover:border-primary/40 transition-colors"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-label-md shrink-0 ${
                        isForgot
                          ? 'bg-score-forgot text-on-primary'
                          : 'bg-score-partial text-on-surface'
                      }`}
                    >
                      {q.id}
                    </span>
                    <span className="font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant truncate">
                      {q.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onToggleBookmark(q.id)}
                      className={`p-1.5 rounded-full transition-colors ${
                        q.isBookmarked
                          ? 'text-secondary hover:bg-secondary/10'
                          : 'text-on-surface-variant/40 hover:text-secondary hover:bg-surface-subtle'
                      }`}
                      title={q.isBookmarked ? 'Bỏ ghim' : 'Ghim vào sổ tay'}
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={q.isBookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        bookmark
                      </span>
                    </button>
                    <span
                      className={`text-label-sm px-2 py-0.5 rounded-full font-bold ${
                        isForgot
                          ? 'bg-score-forgot/10 text-score-forgot'
                          : 'bg-score-partial/10 text-score-partial'
                      }`}
                    >
                      {isForgot ? 'Quên hẳn' : 'Chưa vững'}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-body-lg-bold text-body-lg-bold text-on-surface leading-snug">
                  {q.title}
                </h3>

                {/* Core answer summary */}
                <div className="p-3 bg-surface-subtle rounded-xl border border-border-subtle/80 text-body-sm text-on-surface leading-relaxed">
                  <span className="font-bold text-primary mr-1">Cốt lõi:</span>
                  {q.easyAnswer.coreMeaning}
                </div>

                {/* Common Pitfalls / Mistakes warning */}
                {q.commonMistakes && q.commonMistakes.length > 0 && (
                  <div className="p-3 bg-score-forgot/5 border border-score-forgot/20 rounded-xl flex flex-col gap-1">
                    <span className="font-label-sm text-label-sm font-bold text-score-forgot flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">warning</span>
                      Điểm dễ nhầm lẫn / Hay quên:
                    </span>
                    <ul className="list-disc list-inside text-body-sm text-on-surface-variant space-y-0.5">
                      {q.commonMistakes.map((m, mIdx) => (
                        <li key={mIdx}>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Personal Notes Section */}
                <div className="flex flex-col gap-1.5 pt-1">
                  {editingNoteId === q.id ? (
                    <div className="flex flex-col gap-2 p-2.5 bg-surface-subtle rounded-xl border border-primary/40">
                      <textarea
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        placeholder="Ghi chú điểm hay quên của bạn (VD: Hay quên tôn chỉ số 4...)"
                        rows={2}
                        className="w-full bg-surface-card p-2 rounded-lg text-body-md text-on-surface border border-outline focus:outline-none focus:border-primary resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingNoteId(null)}
                          className="px-3 py-1 text-label-sm font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() => handleSaveNote(q.id)}
                          className="px-3.5 py-1 text-label-sm font-bold bg-primary text-on-primary rounded-lg shadow-xs"
                        >
                          Lưu ghi chú
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle/60 border border-border-subtle/60 text-body-sm">
                      <div className="flex items-center gap-1.5 text-on-surface-variant truncate">
                        <span className="material-symbols-outlined text-[16px] text-secondary">edit</span>
                        <span className="truncate">
                          {q.userNote ? (
                            <strong className="text-on-surface">{q.userNote}</strong>
                          ) : (
                            <span className="italic opacity-60">Chưa có ghi chú riêng...</span>
                          )}
                        </span>
                      </div>
                      <button
                        onClick={() => handleStartEditNote(q)}
                        className="text-label-sm font-bold text-primary hover:underline shrink-0 ml-2"
                      >
                        {q.userNote ? 'Sửa' : '+ Thêm ghi chú'}
                      </button>
                    </div>
                  )}
                </div>

                {/* 4 Feature Practice Triggers for this mistake */}
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-border-subtle">
                  <button
                    onClick={() => onPracticeQuestion(q.id, 'chunk')}
                    className="p-2 rounded-xl bg-surface-subtle hover:bg-surface-container text-primary font-label-sm text-label-sm font-bold flex flex-col items-center gap-0.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">view_carousel</span>
                    <span>Từng đoạn</span>
                  </button>

                  <button
                    onClick={() => onPracticeQuestion(q.id, 'cloze')}
                    className="p-2 rounded-xl bg-surface-subtle hover:bg-surface-container text-secondary font-label-sm text-label-sm font-bold flex flex-col items-center gap-0.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                    <span>Điền từ</span>
                  </button>

                  <button
                    onClick={() => onPracticeQuestion(q.id, 'checklist')}
                    className="p-2 rounded-xl bg-surface-subtle hover:bg-surface-container text-status-mastered font-label-sm text-label-sm font-bold flex flex-col items-center gap-0.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">checklist_rtl</span>
                    <span>Checklist</span>
                  </button>
                </div>

                {/* Mark as Mastered button */}
                <button
                  onClick={() => onUpdateQuestionScore(q.id, 2)}
                  className="w-full py-2 bg-status-mastered/10 hover:bg-status-mastered/20 text-status-mastered rounded-xl font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Đã thuộc lòng, xóa khỏi lỗi sai</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
