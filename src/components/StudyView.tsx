import React, { useState, useEffect } from 'react';
import { QuestionData } from '../data/questions';
import { ChunkStudy } from './ChunkStudy';
import { FillBlanks } from './FillBlanks';
import { KeyPointsChecklist } from './KeyPointsChecklist';

export type StudySubMode = 'overview' | 'chunk' | 'cloze' | 'checklist';

interface StudyViewProps {
  questions: QuestionData[];
  initialQuestionId?: number;
  initialSubMode?: StudySubMode;
  onUpdateQuestionScore: (id: number, score: number) => void;
  onToggleBookmark?: (id: number) => void;
  onFinishStudySession?: () => void;
}

export const StudyView: React.FC<StudyViewProps> = ({
  questions,
  initialQuestionId = 6,
  initialSubMode = 'overview',
  onUpdateQuestionScore,
  onToggleBookmark,
}) => {
  const [currentId, setCurrentId] = useState<number>(initialQuestionId);
  const [subMode, setSubMode] = useState<StudySubMode>(initialSubMode);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(true);
  const [isAnswerOpen, setIsAnswerOpen] = useState<boolean>(true);
  const [answerTab, setAnswerTab] = useState<'easy' | 'full'>('easy');
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [hasUsedHint, setHasUsedHint] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showHintWarning, setShowHintWarning] = useState<boolean>(false);

  // Sync when initialQuestionId changes from navigation
  useEffect(() => {
    if (initialQuestionId) {
      setCurrentId(initialQuestionId);
      const targetQ = questions.find((q) => q.id === initialQuestionId);
      if (targetQ) {
        setSelectedScore(targetQ.score);
      }
    }
  }, [initialQuestionId, questions]);

  useEffect(() => {
    if (initialSubMode) {
      setSubMode(initialSubMode);
    }
  }, [initialSubMode]);

  const currentQuestion = questions.find((q) => q.id === currentId) || questions[0];
  const currentIndex = questions.findIndex((q) => q.id === currentId);
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  // Handle TTS
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectScore = (score: number) => {
    if (score === 2 && hasUsedHint) {
      setShowHintWarning(true);
      setTimeout(() => setShowHintWarning(false), 3000);
      return;
    }
    setSelectedScore(score);
    onUpdateQuestionScore(currentQuestion.id, score);
  };

  const handleNextQuestion = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setShowHintWarning(false);
    if (currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      setCurrentId(nextQ.id);
      setSelectedScore(nextQ.score);
      setIsAnswerOpen(true);
      setHasUsedHint(false);
      setIsHintOpen(false);
      setAnswerTab('easy');
    } else {
      const firstQ = questions[0];
      setCurrentId(firstQ.id);
      setSelectedScore(firstQ.score);
      setIsAnswerOpen(true);
      setHasUsedHint(false);
      setIsHintOpen(false);
    }
  };

  const handlePrevQuestion = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setShowHintWarning(false);
    if (currentIndex > 0) {
      const prevQ = questions[currentIndex - 1];
      setCurrentId(prevQ.id);
      setSelectedScore(prevQ.score);
      setIsAnswerOpen(true);
      setHasUsedHint(false);
      setIsHintOpen(false);
      setAnswerTab('easy');
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'mastered':
        return 'Đã vững';
      case 'learning':
        return 'Đang học';
      case 'review':
        return 'Cần ôn gấp';
      default:
        return 'Học mới';
    }
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Progress & Session Metadata */}
      <div className="flex flex-col gap-space-sm mb-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-md text-headline-md text-primary">
              Câu {currentQuestion.number}/10
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
            <span className="font-label-sm text-label-sm uppercase px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-bold">
              {getStatusLabel(currentQuestion.status)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(currentQuestion.id)}
                className={`p-1 rounded-full transition-colors ${
                  currentQuestion.isBookmarked
                    ? 'text-secondary hover:bg-secondary/15'
                    : 'text-on-surface-variant hover:text-secondary hover:bg-surface-subtle'
                }`}
                title={currentQuestion.isBookmarked ? 'Đã ghim trong sổ tay' : 'Ghim vào sổ tay lỗi sai'}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={currentQuestion.isBookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  bookmark
                </span>
              </button>
            )}
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">auto_stories</span>
              <span>{currentQuestion.category}</span>
            </div>
          </div>
        </div>

        {/* Progress Track */}
        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
          <div
            className="bg-primary-container h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Selector Slider */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1 text-label-sm font-label-sm px-2 py-1 rounded hover:bg-surface-subtle transition-colors ${
              currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Câu trước</span>
          </button>

          {/* Quick jump dot indicators */}
          <div className="flex items-center gap-1">
            {questions.map((q) => (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentId(q.id);
                  setSelectedScore(q.score);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  q.id === currentId
                    ? 'bg-primary scale-125 ring-2 ring-primary/30'
                    : q.status === 'mastered'
                    ? 'bg-score-remembered'
                    : q.status === 'learning'
                    ? 'bg-score-partial'
                    : q.status === 'review'
                    ? 'bg-score-forgot'
                    : 'bg-outline-variant/40'
                }`}
                title={`Câu ${q.id}`}
              />
            ))}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={currentIndex === questions.length - 1}
            className={`flex items-center gap-1 text-label-sm font-label-sm px-2 py-1 rounded hover:bg-surface-subtle transition-colors ${
              currentIndex === questions.length - 1 ? 'opacity-30 cursor-not-allowed' : 'text-primary'
            }`}
          >
            <span>Câu sau</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 4 LEARNING MODES NAVIGATION TABS */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-surface-subtle rounded-2xl mb-space-md border border-border-subtle">
        <button
          onClick={() => setSubMode('overview')}
          className={`py-2 px-1 rounded-xl text-center font-label-md text-label-md flex flex-col items-center gap-0.5 transition-all ${
            subMode === 'overview'
              ? 'bg-surface-card text-primary font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          <span>Tổng quan</span>
        </button>

        <button
          onClick={() => setSubMode('chunk')}
          className={`py-2 px-1 rounded-xl text-center font-label-md text-label-md flex flex-col items-center gap-0.5 transition-all ${
            subMode === 'chunk'
              ? 'bg-surface-card text-primary font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">view_carousel</span>
          <span>Từng đoạn</span>
        </button>

        <button
          onClick={() => setSubMode('cloze')}
          className={`py-2 px-1 rounded-xl text-center font-label-md text-label-md flex flex-col items-center gap-0.5 transition-all ${
            subMode === 'cloze'
              ? 'bg-surface-card text-secondary font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">edit_note</span>
          <span>Điền từ</span>
        </button>

        <button
          onClick={() => setSubMode('checklist')}
          className={`py-2 px-1 rounded-xl text-center font-label-md text-label-md flex flex-col items-center gap-0.5 transition-all ${
            subMode === 'checklist'
              ? 'bg-surface-card text-status-mastered font-bold shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">checklist_rtl</span>
          <span>Checklist</span>
        </button>
      </div>

      {/* SUBMODE 1: HỌC TỪNG ĐOẠN */}
      {subMode === 'chunk' && (
        <div className="mb-space-md">
          <ChunkStudy question={currentQuestion} />
        </div>
      )}

      {/* SUBMODE 2: ĐIỀN TỪ CÒN THIẾU */}
      {subMode === 'cloze' && (
        <div className="mb-space-md">
          <FillBlanks question={currentQuestion} />
        </div>
      )}

      {/* SUBMODE 3: CHECKLIST Ý CHÍNH */}
      {subMode === 'checklist' && (
        <div className="mb-space-md">
          <KeyPointsChecklist question={currentQuestion} />
        </div>
      )}

      {/* SUBMODE 0: TỔNG QUAN 3 TẦNG TRUYỀN THỐNG */}
      {subMode === 'overview' && (
        <div className="flex flex-col bg-surface-card rounded-xl shadow-sm border border-border-subtle overflow-hidden mb-space-lg">
          {/* TẦNG 1: CÂU HỎI */}
          <div className="p-space-md flex flex-col gap-space-sm bg-surface-card border-b border-border-subtle">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-vovinam-deep-ocean font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">quiz</span>
                Tầng 1: Câu hỏi
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-subtle px-2 py-0.5 rounded-full">
                {currentQuestion.category}
              </span>
            </div>

            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
              Câu {currentQuestion.number}. {currentQuestion.title}
            </h2>

            {/* Vocal recitation coach banner */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-surface-container-low text-primary-container text-body-md font-body-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0">volume_up</span>
                <span className="text-body-md font-body-md leading-snug">
                  Đọc câu hỏi và trả lời thành tiếng trước khi xem đáp án
                </span>
              </div>
              <button
                onClick={() => handleSpeak(currentQuestion.title)}
                className="p-1 rounded-md hover:bg-primary-fixed text-primary transition-colors shrink-0"
                title="Đọc to câu hỏi"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isSpeaking ? 'stop_circle' : 'play_circle'}
                </span>
              </button>
            </div>
          </div>

          {/* TẦNG 2: GỢI NHỚ TỪ KHÓA */}
          <div className="p-space-md bg-surface-subtle flex flex-col gap-space-xs border-b border-border-subtle">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setIsHintOpen(!isHintOpen);
                  if (!isHintOpen) setHasUsedHint(true);
                }}
                className="flex items-center gap-1.5 text-secondary hover:text-secondary-container transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                <span className="font-label-md text-label-md font-bold uppercase tracking-wide">
                  Tầng 2: Gợi nhớ từ khóa
                </span>
                <span className="material-symbols-outlined text-[16px]">
                  {isHintOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Hint penalty badge */}
              {hasUsedHint && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[13px] text-score-partial">warning</span>
                  Đã dùng gợi ý (Tối đa 1đ)
                </span>
              )}
            </div>

            {isHintOpen && (
              <div className="p-3 rounded-lg bg-surface-card text-on-surface text-body-md font-body-md shadow-xs animate-in fade-in duration-150">
                <span className="font-body-lg-bold text-secondary">Từ khóa gợi nhớ:</span>
                <span className="font-body-md text-on-surface"> {currentQuestion.hintWords}</span>
              </div>
            )}
          </div>

          {/* TẦNG 3: ĐÁP ÁN CHI TIẾT */}
          <div className="p-space-md bg-surface-card flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-score-remembered font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Tầng 3: Đáp án chuẩn
              </span>
              <button
                onClick={() => setIsAnswerOpen(!isAnswerOpen)}
                className="font-label-sm text-label-sm text-score-remembered bg-surface-container px-2 py-0.5 rounded-full hover:bg-surface-container-high transition-colors"
              >
                {isAnswerOpen ? 'Đã lật mở' : 'Chạm để xem đáp án'}
              </button>
            </div>

            {isAnswerOpen && (
              <>
                {/* Segmented View Mode Tabs */}
                <div className="flex p-1 bg-surface-subtle rounded-lg gap-1" role="tablist">
                  <button
                    type="button"
                    onClick={() => setAnswerTab('easy')}
                    className={`flex-1 py-1.5 px-3 rounded text-center font-label-md text-label-md transition-all ${
                      answerTab === 'easy'
                        ? 'bg-surface-card text-primary font-bold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Bản dễ thuộc
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswerTab('full')}
                    className={`flex-1 py-1.5 px-3 rounded text-center font-label-md text-label-md transition-all ${
                      answerTab === 'full'
                        ? 'bg-surface-card text-primary font-bold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Đáp án đầy đủ (nguồn)
                  </button>
                </div>

                {/* Tab Content 1: Bản dễ thuộc */}
                {answerTab === 'easy' && (
                  <div className="flex flex-col gap-space-sm animate-in fade-in duration-150">
                    <div className="p-3.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex flex-col gap-1 border border-secondary/20">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">bookmark</span>
                        Câu tâm niệm bắt buộc
                      </span>
                      <p className="font-body-lg-bold text-headline-md text-on-secondary-fixed leading-snug">
                        {currentQuestion.easyAnswer.headlineQuote}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-surface-subtle flex flex-col gap-1 border border-border-subtle">
                      <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
                        Ý nghĩa cốt lõi
                      </span>
                      <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                        {currentQuestion.easyAnswer.coreMeaning}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-container flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-on-primary text-[14px]">psychology</span>
                      </div>
                      <div className="text-body-md font-body-md text-primary leading-tight">
                        <span className="font-body-lg-bold">Mẹo nhớ: </span>
                        <span>{currentQuestion.easyAnswer.mnemonic}</span>
                      </div>
                    </div>

                    {currentQuestion.visualDetails?.fourColors && (
                      <div className="grid grid-cols-2 gap-2 pt-1 text-on-surface-variant font-body-md text-body-md">
                        {currentQuestion.visualDetails.fourColors.map((c, idx) => (
                          <div key={idx} className="p-2 rounded bg-surface-subtle flex items-center gap-2">
                            <span className={`w-3.5 h-3.5 rounded-full ${c.colorClass} shrink-0`} />
                            <span className="text-xs">
                              <strong>{c.name}:</strong> {c.meaning}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab Content 2: Đáp án đầy đủ */}
                {answerTab === 'full' && (
                  <div className="flex flex-col gap-space-sm animate-in fade-in duration-150">
                    <div className="p-3.5 rounded-xl bg-surface-subtle text-on-surface flex flex-col gap-2.5 leading-relaxed text-body-md border border-border-subtle">
                      <p className="font-body-lg-bold text-primary">{currentQuestion.fullAnswer.intro}</p>

                      {currentQuestion.fullAnswer.quote && (
                        <blockquote className="pl-3 italic text-on-surface bg-surface-card p-2.5 rounded-lg border-l-2 border-primary">
                          {currentQuestion.fullAnswer.quote}
                        </blockquote>
                      )}

                      {currentQuestion.fullAnswer.paragraphs.map((p, idx) => (
                        <p key={idx} className="font-body-md text-body-md">
                          {p}
                        </p>
                      ))}

                      {currentQuestion.fullAnswer.bulletPoints && (
                        <div className="flex flex-col gap-1.5 pt-1">
                          {currentQuestion.fullAnswer.bulletPoints.map((b, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-2 rounded bg-surface-card">
                              <span className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${b.color || 'bg-primary'}`} />
                              <div className="text-body-md">
                                <strong className="text-on-surface font-semibold">{b.label}:</strong> {b.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Hint Penalty Warning Toast */}
      {showHintWarning && (
        <div className="mb-2 p-2.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
          <span>Bạn đã mở gợi ý ở Tầng 2, câu này được giới hạn tối đa 1 điểm để đảm bảo tính khách quan!</span>
        </div>
      )}

      {/* Thumb-Zone Self-Assessment Bar (3 Big Actions) */}
      <div className="flex flex-col gap-space-xs mb-space-md">
        <div className="flex items-center justify-between px-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">
            Tự đánh giá kết quả
          </span>
          <span className="font-label-sm text-label-sm text-score-partial font-semibold">
            {selectedScore !== null ? `Đã chọn: ${selectedScore}đ` : 'Chạm để chọn điểm'}
          </span>
        </div>

        {/* 3-way Split Responsive Button Array */}
        <div className="grid grid-cols-3 gap-2">
          {/* 0 Điểm - Quên */}
          <button
            type="button"
            onClick={() => handleSelectScore(0)}
            className={`h-14 px-2 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 shadow-sm border ${
              selectedScore === 0
                ? 'bg-score-forgot text-white border-score-forgot scale-[1.02]'
                : 'bg-surface-card text-score-forgot border-border-subtle hover:bg-surface-subtle'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">replay</span>
              <span className="font-headline-md text-headline-md font-bold">0đ</span>
            </div>
            <span className="font-label-sm text-label-sm font-bold">Quên</span>
          </button>

          {/* 1 Điểm - Nhớ một phần */}
          <button
            type="button"
            onClick={() => handleSelectScore(1)}
            className={`h-14 px-2 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 shadow-sm border ${
              selectedScore === 1
                ? 'bg-score-partial text-white border-score-partial scale-[1.02]'
                : 'bg-surface-card text-score-partial border-border-subtle hover:bg-surface-subtle'
            }`}
          >
            <div className="flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[18px]"
                style={selectedScore === 1 ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                check_circle
              </span>
              <span className="font-headline-md text-headline-md font-bold">1đ</span>
            </div>
            <span className="font-label-sm text-label-sm font-bold">Nhớ 1 phần</span>
          </button>

          {/* 2 Điểm - Trả lời được */}
          <button
            type="button"
            onClick={() => handleSelectScore(2)}
            title={hasUsedHint ? 'Đã xem gợi ý: tối đa 1 điểm' : 'Thuộc làu 2 điểm'}
            className={`h-14 px-2 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 shadow-sm border ${
              hasUsedHint
                ? 'opacity-40 bg-surface-card border-border-subtle cursor-not-allowed text-score-remembered'
                : selectedScore === 2
                ? 'bg-score-remembered text-white border-score-remembered scale-[1.02]'
                : 'bg-surface-card text-score-remembered border-border-subtle hover:bg-surface-subtle'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span className="font-headline-md text-headline-md font-bold">2đ</span>
            </div>
            <span className={`font-label-sm text-label-sm font-bold ${hasUsedHint ? 'line-through' : ''}`}>
              {hasUsedHint ? 'Vững (Khóa)' : 'Vững'}
            </span>
          </button>
        </div>
      </div>

      {/* Full-Width Primary Action: Câu tiếp theo */}
      <button
        type="button"
        onClick={handleNextQuestion}
        className="w-full h-12 rounded-xl bg-primary-container text-on-primary font-body-lg-bold text-body-lg-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 hover:brightness-105"
      >
        <span>Câu tiếp theo</span>
        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
      </button>
    </div>
  );
};
