import React, { useState, useEffect } from 'react';
import { QuestionData } from '../data/questions';

interface ExamViewProps {
  questions: QuestionData[];
  onFinishExam: (examScores: Record<number, number>) => void;
  onGoHome: () => void;
  onGoStudyWeak: () => void;
}

export const ExamView: React.FC<ExamViewProps> = ({
  questions,
  onGoHome,
  onGoStudyWeak,
}) => {
  // Shuffled sequence of questions for the exam
  const [examOrder, setExamOrder] = useState<number[]>([1, 4, 2, 6, 3, 5, 7, 8, 9, 10]);
  const [examIndex, setExamIndex] = useState<number>(0);
  const [examScores, setExamScores] = useState<Record<number, number>>({
    1: 2,
    4: 0,
    2: 1,
  });
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [timerActive, setTimerActive] = useState<boolean>(true);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(272); // ~ 04:32
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState<boolean>(false);

  // Countdown timer effect
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const currentQuestionId = examOrder[examIndex] || examOrder[0];
  const currentQuestion =
    questions.find((q) => q.id === currentQuestionId) || questions[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleGradeAndAdvance = (score: number) => {
    const updated = { ...examScores, [currentQuestionId]: score };
    setExamScores(updated);

    if (examIndex < examOrder.length - 1) {
      setExamIndex(examIndex + 1);
      setIsAnswerRevealed(false);
    } else {
      // Completed all 10 questions! Open summary
      setIsSummaryModalOpen(true);
    }
  };

  const handleRestartExam = () => {
    // Shuffle 10 question IDs
    const shuffled = [...questions.map((q) => q.id)].sort(() => 0.5 - Math.random());
    setExamOrder(shuffled);
    setExamIndex(0);
    setExamScores({});
    setIsAnswerRevealed(false);
    setRemainingSeconds(900); // 15 mins
    setTimerActive(true);
    setIsSummaryModalOpen(false);
  };

  // Compute summary stats
  const totalPoints = Object.values(examScores).reduce((acc, val) => acc + val, 0);
  const maxPossible = examOrder.length * 2;
  const percentScore = Math.round((totalPoints / maxPossible) * 100);

  const countTwoPts = Object.values(examScores).filter((s) => s === 2).length;
  const countOnePt = Object.values(examScores).filter((s) => s === 1).length;
  const countZeroPts = Object.values(examScores).filter((s) => s === 0).length;

  const weakQuestions = examOrder
    .filter((id) => (examScores[id] ?? 2) < 2)
    .map((id) => questions.find((q) => q.id === id)!)
    .filter(Boolean);

  const dojoPhoto =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAYK4TIde6Om2EdMEDCh4LMVS_WaSyM6Ke19tDLZDDQq8qrrwK-5-5UrjYkeaUYYAgLnFIQ-lNlA3jXN3lK33HSmMe97zt3QbV4HPPaj5Aod--noY4KYhETQJOTdrlylZ-237WGE7tZ3aVsEGrDCpaLgrSSrMYksU8_S2D-eKHWGbCw3VCgWAlxWFeyb0ZX_AprybPJ3HO_LMvIvLVlP0A0H_8eywHu8-c81CM7hBNY8R4Smc3xvAAs';

  const emblemPhoto =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCcW_sDpxOwFzgXNoUUhLV5wSHH8LZg4qV8ZPVkkJPBsddH-PMODrRxPrusO04dfQnO-psraKPCfXrbnu5KnKnpHhm52nq5XzsRLE2sSAvK8QYIOTirJ2Ob1M2zwUlQRuR-B14CDHOJHcOJWzAII9S5pPF-NTFBIt84mHPCKRXg3PpiVl1plBb3fxIN1PFQkTfl9VqacwFe7ppfHea4C6MHj8vRUPPpIFXSfc8u0U-DRgHIa_lexYPo';

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Exam Arena Control Bar */}
      <section className="bg-surface-card rounded-xl shadow-sm border border-border-subtle p-space-md mb-space-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-fixed text-primary shrink-0">
              <span className="material-symbols-outlined text-[18px]">record_voice_over</span>
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Thi thử vấn đáp ngẫu nhiên 10 câu
            </h2>
          </div>
          <button
            onClick={() => setTimerActive(!timerActive)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-subtle text-on-surface-variant hover:text-primary transition-colors text-label-sm font-label-sm"
          >
            <span className="material-symbols-outlined text-[16px]">
              {timerActive ? 'timer' : 'timer_off'}
            </span>
            <span>{timerActive ? 'Tắt đồng hồ' : 'Bật đồng hồ'}</span>
          </button>
        </div>

        {/* Timer Countdown & Stepper Track */}
        <div className="flex items-center justify-between bg-surface-subtle px-3 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <span
              className={`material-symbols-outlined text-secondary text-[20px] ${
                timerActive ? 'animate-pulse' : 'opacity-50'
              }`}
            >
              timelapse
            </span>
            <span
              className={`font-headline-md text-headline-md text-secondary ${
                !timerActive ? 'opacity-40' : ''
              }`}
            >
              {formatTime(remainingSeconds)}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">/ 15:00</span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
            <span className="font-body-lg-bold text-primary font-bold">
              Câu {examIndex + 1} / {examOrder.length}
            </span>
            <span className="text-on-surface-variant text-[11px]">(Trộn ngẫu nhiên)</span>
          </div>
        </div>

        {/* 10-Question Visual Progress Dots */}
        <div className="grid grid-cols-10 gap-1.5 pt-1">
          {examOrder.map((qId, idx) => {
            const score = examScores[qId];
            let dotColor = 'bg-surface-subtle';
            if (idx === examIndex) {
              dotColor = 'bg-primary ring-2 ring-primary/40 animate-pulse';
            } else if (score === 2) {
              dotColor = 'bg-status-mastered';
            } else if (score === 1) {
              dotColor = 'bg-status-reviewing';
            } else if (score === 0) {
              dotColor = 'bg-score-forgot';
            }

            return (
              <button
                key={qId}
                onClick={() => {
                  setExamIndex(idx);
                  setIsAnswerRevealed(false);
                }}
                className={`h-1.5 rounded-full transition-all ${dotColor}`}
                title={`Câu ${idx + 1}`}
              />
            );
          })}
        </div>
      </section>

      {/* Martial Recall Visual Card */}
      <div className="relative w-full h-36 rounded-xl overflow-hidden shadow-sm mb-space-md bg-surface-container">
        <img
          src={dojoPhoto}
          alt="Martial artist master and student bowing in dojo"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent flex flex-col justify-end p-4">
          <div className="flex items-center gap-1.5 text-secondary-fixed mb-0.5">
            <span className="material-symbols-outlined text-[16px]">sports_martial_arts</span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
              Võ Đạo &amp; Nghi thức Vovinam
            </span>
          </div>
          <p className="font-label-md text-label-md text-on-primary opacity-90">
            Rèn luyện khẩu khí dõng dạc, giữ trọn tâm thế nghiêm trang trước võ đường.
          </p>
        </div>
      </div>

      {/* Primary Interactive Question Stage */}
      <section className="bg-surface-card rounded-xl shadow-md border border-border-subtle p-space-md flex flex-col gap-4">
        {/* Question Badge & Meta */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wide font-bold">
            Câu hỏi số {examIndex + 1}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-subtle text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[14px]">shuffle</span>
            Hệ thống xáo trộn
          </span>
        </div>

        {/* The Prompt */}
        <div className="py-1">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface leading-snug">
            Câu {currentQuestion.number}. {currentQuestion.title}
          </h1>
        </div>

        {/* Active Recite Verbal Prompt Notice */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-secondary-fixed text-on-secondary-fixed shadow-sm border border-secondary/20">
          <span className="text-[24px] leading-none shrink-0 select-none">🗣️</span>
          <div className="flex flex-col">
            <span className="font-body-lg-bold text-body-lg-bold leading-tight">
              Hãy nói to câu trả lời thành tiếng!
            </span>
            <span className="font-body-md text-body-md text-on-secondary-fixed-variant mt-0.5">
              Tự tin trình bày rõ ràng, dứt khoát từng ý trước khi mở phần đối chiếu chuẩn.
            </span>
          </div>
        </div>

        {/* Reveal Stage CTA */}
        {!isAnswerRevealed ? (
          <div className="py-2">
            <button
              onClick={() => setIsAnswerRevealed(true)}
              className="w-full py-4 px-space-md rounded-xl bg-primary text-on-primary font-headline-md text-headline-md flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-transform hover:bg-primary-container"
            >
              <span className="material-symbols-outlined text-[24px]">visibility</span>
              <span>Hiện đáp án &amp; Đối chiếu</span>
            </button>
          </div>
        ) : (
          /* Answer Reveal & Verification Drawer */
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <div className="bg-surface-subtle rounded-xl p-4 flex flex-col gap-3.5 border border-border-subtle">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span className="font-label-md text-label-md uppercase font-bold">
                    Nội dung đối chiếu chuẩn ({currentQuestion.category})
                  </span>
                </div>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-card text-on-surface-variant font-medium">
                  Giáo trình Võ 3
                </span>
              </div>

              {/* Standard quote */}
              <div className="p-3 rounded-lg bg-surface-card border border-border-subtle text-on-surface font-body-md text-body-md">
                <span className="font-body-lg-bold text-primary">Ý chính cần đạt:</span>
                <p className="mt-1 font-semibold">{currentQuestion.easyAnswer.headlineQuote}</p>
                <p className="mt-1 text-xs text-on-surface-variant leading-relaxed">
                  {currentQuestion.easyAnswer.coreMeaning}
                </p>
              </div>

              {/* Visual Breakdown if applicable */}
              {currentQuestion.visualDetails?.fourColors && (
                <div className="flex flex-col gap-2">
                  <span className="font-body-lg-bold text-body-lg-bold text-on-surface">1. Ý nghĩa 4 màu sắc:</span>
                  <div className="grid grid-cols-1 gap-2 pl-1">
                    {currentQuestion.visualDetails.fourColors.map((col, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-card shadow-xs">
                        <span className={`w-3.5 h-3.5 rounded-full ${col.colorClass} mt-1 shrink-0`} />
                        <div className="font-body-md text-body-md text-on-surface">
                          <strong>{col.name}:</strong> {col.meaning}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentQuestion.visualDetails?.threeShapes && (
                <div className="flex flex-col gap-2 mt-1">
                  <span className="font-body-lg-bold text-body-lg-bold text-on-surface">2. Ý nghĩa 3 hình nét:</span>
                  <div className="grid grid-cols-1 gap-2 pl-1">
                    {currentQuestion.visualDetails.threeShapes.map((shape, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-surface-card shadow-xs font-body-md text-body-md text-on-surface">
                        <strong className="text-vovinam-deep-ocean">{shape.name}:</strong> {shape.meaning}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3-Tier Self-Assessment Grading Controls */}
            <div className="flex flex-col gap-2.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant font-bold uppercase tracking-wider">
                  Chọn mức độ tự chấm:
                </span>
                <span className="font-label-sm text-label-sm text-primary font-medium">
                  Trung thực tuyệt đối
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* 0: Quên */}
                <button
                  type="button"
                  onClick={() => handleGradeAndAdvance(0)}
                  className="h-14 px-1 rounded-xl bg-error-container text-on-error-container flex flex-col items-center justify-center shadow-xs active:scale-95 transition-transform hover:brightness-95"
                >
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px] text-score-forgot">close</span>
                    <span className="font-body-lg-bold text-body-lg-bold">0 điểm</span>
                  </div>
                  <span className="font-label-sm text-label-sm">Quên bài</span>
                </button>

                {/* 1: Nhớ một phần */}
                <button
                  type="button"
                  onClick={() => handleGradeAndAdvance(1)}
                  className="h-14 px-1 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex flex-col items-center justify-center shadow-xs active:scale-95 transition-transform hover:brightness-95"
                >
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px] text-secondary">change_history</span>
                    <span className="font-body-lg-bold text-body-lg-bold">1 điểm</span>
                  </div>
                  <span className="font-label-sm text-label-sm">Nhớ một phần</span>
                </button>

                {/* 2: Trả lời trọn vẹn */}
                <button
                  type="button"
                  onClick={() => handleGradeAndAdvance(2)}
                  className="h-14 px-1 rounded-xl bg-primary-fixed text-on-primary-fixed flex flex-col items-center justify-center shadow-xs active:scale-95 transition-transform hover:brightness-95"
                >
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                    <span className="font-body-lg-bold text-body-lg-bold">2 điểm</span>
                  </div>
                  <span className="font-label-sm text-label-sm">Trọn vẹn</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Quick Trigger for Summary Review Modal */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setIsSummaryModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-subtle text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md border border-border-subtle"
        >
          <span className="material-symbols-outlined text-[18px]">assessment</span>
          <span>Xem bảng kết quả thi thử mẫu</span>
        </button>
      </div>

      {/* Martial Artwork Card at bottom */}
      <div className="mt-8 rounded-xl bg-surface-card p-4 shadow-sm border border-border-subtle flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg shrink-0 overflow-hidden bg-surface-subtle">
          <img
            src={emblemPhoto}
            alt="Vovinam grandmaster badge emblem"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-body-lg-bold text-body-lg-bold text-on-surface">Võ Đạo tâm niệm</span>
          <span className="font-body-md text-body-md text-on-surface-variant leading-tight">
            Vấn đáp võ đạo là cơ hội phản chiếu sự chuyên cần và định tâm trước võ đường.
          </span>
        </div>
      </div>

      {/* Mock Exam Summary Modal */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center animate-in fade-in duration-200">
          <div className="w-full max-w-[480px] bg-surface-card rounded-2xl shadow-xl p-space-md flex flex-col gap-4 border border-border-subtle">
            {/* Summary Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-status-mastered text-on-primary">
                  <span className="material-symbols-outlined text-[20px]">military_tech</span>
                </span>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Kết Quả Vấn Đáp</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Lượt thi 10 câu ngẫu nhiên
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsSummaryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-subtle text-on-surface-variant flex items-center justify-center hover:bg-surface-dim"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Score Highlight Card */}
            <div className="bg-surface-subtle rounded-xl p-4 flex flex-col items-center justify-center gap-1 shadow-inner border border-border-subtle">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Điểm tự chấm
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-display-mobile text-display-mobile text-primary font-bold">
                  {totalPoints}
                </span>
                <span className="font-headline-md text-headline-md text-on-surface-variant">/ {maxPossible}</span>
              </div>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm font-bold mt-1 ${
                  percentScore >= 80
                    ? 'bg-status-mastered text-white'
                    : percentScore >= 50
                    ? 'bg-secondary text-white'
                    : 'bg-score-forgot text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {percentScore >= 80 ? 'thumb_up' : percentScore >= 50 ? 'trending_up' : 'warning'}
                </span>
                {percentScore >= 80
                  ? `Đạt yêu cầu xuất sắc (${percentScore}%)`
                  : percentScore >= 50
                  ? `Đạt mức khá (${percentScore}%)`
                  : `Cần nỗ lực thêm (${percentScore}%)`}
              </div>
            </div>

            {/* Breakdown Metrics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-surface-subtle flex flex-col items-center text-center border border-border-subtle">
                <span className="font-headline-md text-headline-md text-status-mastered font-bold">
                  {countTwoPts || 7} câu
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Đạt 2 điểm</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-subtle flex flex-col items-center text-center border border-border-subtle">
                <span className="font-headline-md text-headline-md text-status-reviewing font-bold">
                  {countOnePt || 2} câu
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Đạt 1 điểm</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-subtle flex flex-col items-center text-center border border-border-subtle">
                <span className="font-headline-md text-headline-md text-score-forgot font-bold">
                  {countZeroPts || 1} câu
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Quên (0 đ)</span>
              </div>
            </div>

            {/* Retest / Review Needed List */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant font-bold uppercase tracking-wider">
                  Danh sách cần ôn gấp:
                </span>
                <span className="font-label-sm text-label-sm text-score-forgot font-bold">
                  {weakQuestions.length || 2} nội dung
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {weakQuestions.length > 0 ? (
                  weakQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-error-container text-on-error-container border border-score-forgot/20"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px] text-score-forgot">error</span>
                        <div className="flex flex-col">
                          <span className="font-body-lg-bold text-body-lg-bold line-clamp-1">
                            Câu {q.number}: {q.title}
                          </span>
                          <span className="font-label-sm text-label-sm">
                            Đánh giá: {examScores[q.id] === 1 ? 'Nhớ một phần (1 điểm)' : 'Quên (0 điểm)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-error-container text-on-error-container">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px] text-score-forgot">error</span>
                        <div className="flex flex-col">
                          <span className="font-body-lg-bold text-body-lg-bold">Câu 4: 5 tôn chỉ Vovinam</span>
                          <span className="font-label-sm text-label-sm">Đánh giá: Quên (0 điểm)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary-fixed text-on-secondary-fixed">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px] text-secondary">help</span>
                        <div className="flex flex-col">
                          <span className="font-body-lg-bold text-body-lg-bold">Câu 9: Điều 9 - Tác phong kỷ luật</span>
                          <span className="font-label-sm text-label-sm">Đánh giá: Nhớ một phần (1 điểm)</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  setIsSummaryModalOpen(false);
                  onGoStudyWeak();
                }}
                className="w-full h-12 rounded-xl bg-primary text-on-primary font-headline-md text-headline-md flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm hover:bg-primary-container"
              >
                <span className="material-symbols-outlined text-[20px]">fitness_center</span>
                <span>Ôn các câu chưa vững ngay</span>
              </button>
              <button
                onClick={handleRestartExam}
                className="w-full h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-headline-md text-headline-md flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-secondary-fixed-dim"
              >
                <span className="material-symbols-outlined text-[20px]">replay</span>
                <span>Thi lại đợt mới</span>
              </button>
              <button
                onClick={() => {
                  setIsSummaryModalOpen(false);
                  onGoHome();
                }}
                className="w-full h-12 rounded-xl bg-surface-subtle text-on-surface font-headline-md text-headline-md flex items-center justify-center gap-2 hover:bg-surface-dim active:scale-95 transition-transform border border-border-subtle"
              >
                <span className="material-symbols-outlined text-[20px]">home</span>
                <span>Về trang chủ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
