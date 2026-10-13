import React, { useState, useEffect } from 'react';
import { QuestionData } from '../data/questions';
import { ChunkStudy } from './ChunkStudy';
import { FillBlanks } from './FillBlanks';
import { KeyPointsChecklist } from './KeyPointsChecklist';
import { vnSpeech, VoiceSpeed } from '../utils/tts';

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
  const [voiceSpeed, setVoiceSpeed] = useState<VoiceSpeed>(0.8 as VoiceSpeed);
  const [showHintWarning, setShowHintWarning] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');

  // Sync listener with vnSpeech
  useEffect(() => {
    return vnSpeech.addListener((speaking) => setIsSpeaking(speaking));
  }, []);

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

  // Handle Vietnamese TTS & Cloned Audio
  const handleSpeak = (text: string, audioUrl?: string) => {
    vnSpeech.toggle(text, audioUrl);
  };

  const handleSetSpeed = (newSpeed: VoiceSpeed) => {
    setVoiceSpeed(newSpeed);
    vnSpeech.setSpeed(newSpeed);
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
    vnSpeech.stop();
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
    vnSpeech.stop();
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

  const toggleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xl');
    else setFontSize('normal');
  };

  const textClass = {
    normal: 'text-[15px] leading-relaxed',
    large: 'text-[17px] leading-relaxed',
    xl: 'text-[19px] leading-relaxed font-medium',
  }[fontSize];

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Session Progress Bar */}
      <div className="flex flex-col gap-2 mb-3 bg-surface-card p-3 rounded-2xl border border-border-subtle shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary text-on-primary font-bold text-label-md flex items-center justify-center shadow-xs">
              {currentQuestion.number}
            </span>
            <span className="font-label-md text-label-md font-bold text-on-surface">
              Câu {currentQuestion.number} / {questions.length}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-subtle text-on-surface-variant uppercase border border-border-subtle">
              {currentQuestion.category}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Font size toggle button */}
            <button
              onClick={toggleFontSize}
              className="px-2 py-1 rounded-lg bg-surface-subtle hover:bg-surface-container text-label-sm font-bold text-primary border border-border-subtle transition-colors flex items-center gap-0.5"
              title="Chỉnh cỡ chữ đọc"
            >
              <span className="material-symbols-outlined text-[15px]">format_size</span>
              <span>{fontSize === 'normal' ? 'Chuẩn' : fontSize === 'large' ? 'To' : 'Rất to'}</span>
            </button>

            {/* Bookmark button */}
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(currentQuestion.id)}
                className={`p-1.5 rounded-lg border transition-all active:scale-95 ${
                  currentQuestion.isBookmarked
                    ? 'border-secondary/40 bg-secondary/15 text-secondary'
                    : 'border-border-subtle bg-surface-subtle text-on-surface-variant/60 hover:text-secondary'
                }`}
                title={currentQuestion.isBookmarked ? 'Đã ghim sổ tay' : 'Ghim vào sổ tay lỗi'}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={currentQuestion.isBookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  bookmark
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Progress track */}
        <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Numbered 1-10 Pill Bar (Apple-Grade Touch Target) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
          {questions.map((q) => {
            const isSelected = q.id === currentId;
            let badgeStyle = 'border-border-subtle bg-surface-card text-on-surface-variant';
            if (isSelected) {
              badgeStyle = 'bg-primary text-on-primary border-primary shadow-sm ring-2 ring-primary/30 scale-105';
            } else if (q.score === 2) {
              badgeStyle = 'border-status-mastered/40 bg-status-mastered/10 text-status-mastered font-bold';
            } else if (q.score === 1) {
              badgeStyle = 'border-score-partial/40 bg-score-partial/10 text-score-partial font-bold';
            } else if (q.score === 0 && q.readCount && q.readCount > 1) {
              badgeStyle = 'border-score-forgot/40 bg-score-forgot/10 text-score-forgot font-bold';
            }

            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentId(q.id);
                  setSelectedScore(q.score);
                }}
                className={`min-w-[38px] h-9 px-2 rounded-xl border flex items-center justify-center font-bold text-label-md transition-all active:scale-95 shrink-0 ${badgeStyle}`}
                title={`Câu ${q.number}: ${q.title}`}
              >
                <span>#{q.number}</span>
              </button>
            );
          })}
        </div>

        {/* Prev / Next question navigation controls */}
        <div className="flex items-center justify-between pt-1 border-t border-border-subtle/70">
          <button
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1 text-label-md font-bold px-3 py-1.5 rounded-xl border transition-all ${
              currentIndex === 0
                ? 'opacity-30 cursor-not-allowed border-border-subtle text-on-surface-variant'
                : 'text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Câu trước</span>
          </button>

          <span className="text-label-sm font-semibold text-on-surface-variant">
            {currentIndex + 1} / 10
          </span>

          <button
            onClick={handleNextQuestion}
            disabled={currentIndex === questions.length - 1}
            className={`flex items-center gap-1 text-label-md font-bold px-3 py-1.5 rounded-xl border transition-all ${
              currentIndex === questions.length - 1
                ? 'opacity-30 cursor-not-allowed border-border-subtle text-on-surface-variant'
                : 'text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 active:scale-95'
            }`}
          >
            <span>Câu sau</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 4 LEARNING MODES NAVIGATION TABS */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-surface-subtle rounded-2xl mb-space-md border border-border-subtle shadow-xs">
        <button
          onClick={() => setSubMode('overview')}
          className={`py-2 px-1 rounded-xl text-center font-label-md text-label-md flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
            subMode === 'overview'
              ? 'bg-surface-card text-primary font-bold shadow-xs border border-primary/20'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">menu_book</span>
          <span>Tổng quan</span>
        </button>

        <button
          onClick={() => setSubMode('chunk')}
          className={`py-2 px-1 rounded-xl text-center font-label-md text-label-md flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
            subMode === 'chunk'
              ? 'bg-surface-card text-primary font-bold shadow-xs border border-primary/20'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">view_carousel</span>
          <span>Từng đoạn</span>
        </button>

        <button
          onClick={() => setSubMode('cloze')}
          className={`py-2 px-1 rounded-xl text-center font-label-md text-label-md flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
            subMode === 'cloze'
              ? 'bg-surface-card text-secondary font-bold shadow-xs border border-secondary/20'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">edit_note</span>
          <span>Điền từ</span>
        </button>

        <button
          onClick={() => setSubMode('checklist')}
          className={`py-2 px-1 rounded-xl text-center font-label-md text-label-md flex flex-col items-center gap-0.5 transition-all active:scale-95 ${
            subMode === 'checklist'
              ? 'bg-surface-card text-status-mastered font-bold shadow-xs border border-status-mastered/20'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">checklist_rtl</span>
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

      {/* SUBMODE 0: TỔNG QUAN 3 TẦNG THIẾT KẾ MỚI SIÊU DỄ HỌC */}
      {subMode === 'overview' && (
        <div className="flex flex-col bg-surface-card rounded-2xl shadow-sm border border-border-subtle overflow-hidden mb-space-md">
          {/* TẦNG 1: CÂU HỎI */}
          <div className="p-space-md flex flex-col gap-3 bg-gradient-to-b from-primary/5 via-surface-card to-surface-card border-b border-border-subtle">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-label-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-[15px]">quiz</span>
                Tầng 1: Câu hỏi
              </span>
              <span className="text-label-sm text-on-surface-variant font-medium">
                {currentQuestion.category}
              </span>
            </div>

            <h2 className="font-headline-lg-mobile text-[19px] sm:text-[21px] text-on-surface font-bold leading-snug">
              {currentQuestion.title}
            </h2>

            {/* Thanh Giọng Đọc Tiếng Việt Chuẩn */}
            <div className="flex flex-col gap-2 p-3 rounded-2xl bg-gradient-to-r from-primary/10 via-surface-subtle to-secondary/10 border border-primary/20">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isSpeaking ? 'bg-score-forgot text-white animate-pulse' : 'bg-primary/20 text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {isSpeaking ? 'graphic_eq' : 'record_voice_over'}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                      Giọng đọc Tiếng Việt
                      {isSpeaking && (
                        <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-score-forgot/15 text-score-forgot font-bold">
                          Đang đọc...
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-on-surface-variant line-clamp-1">
                      {isSpeaking ? 'Chạm để dừng đọc bất cứ lúc nào' : 'Nghe giọng đọc Tiếng Việt chuẩn để nhẩm theo'}
                    </span>
                  </div>
                </div>

                {/* Tốc độ đọc */}
                <div className="flex items-center gap-1 bg-surface-card p-1 rounded-xl border border-border-subtle shrink-0">
                  <button
                    onClick={() => handleSetSpeed(0.8 as VoiceSpeed)}
                    className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                      voiceSpeed === 0.8
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    title="Đọc chậm để thuộc lòng"
                  >
                    0.8x
                  </button>
                  <button
                    onClick={() => handleSetSpeed(1.0 as VoiceSpeed)}
                    className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                      voiceSpeed === 1.0
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    title="Tốc độ chuẩn"
                  >
                    1.0x
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleSpeak(`${currentQuestion.title}. Ý chính: ${currentQuestion.easyAnswer.headlineQuote}. ${currentQuestion.easyAnswer.coreMeaning}`, `/audio/q${currentQuestion.id}_easy.mp3`)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs transition-all active:scale-98 shadow-xs ${
                    isSpeaking
                      ? 'bg-score-forgot text-white shadow-score-forgot/30'
                      : 'bg-primary text-on-primary hover:brightness-105 shadow-primary/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isSpeaking ? 'stop_circle' : 'volume_up'}
                  </span>
                  <span>{isSpeaking ? 'Dừng đọc' : 'Đọc câu hỏi & ý chính'}</span>
                </button>

                <button
                  onClick={() => handleSpeak(currentQuestion.title)}
                  className="px-3 py-2.5 rounded-xl bg-surface-card hover:bg-surface-subtle text-on-surface border border-border-subtle font-bold text-xs transition-all active:scale-95 shrink-0"
                  title="Chỉ đọc câu hỏi"
                >
                  Chỉ đọc câu hỏi
                </button>
              </div>
            </div>
          </div>

          {/* TẦNG 2: GỢI NHỚ TỪ KHÓA (GỢI Ý TỐC HÀNH) */}
          <div className="p-space-md bg-secondary-fixed/30 border-b border-secondary/20 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setIsHintOpen(!isHintOpen);
                  if (!isHintOpen) setHasUsedHint(true);
                }}
                className="flex items-center gap-1.5 text-secondary hover:brightness-90 transition-colors font-bold text-label-md uppercase tracking-wide"
              >
                <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                <span>Tầng 2: Từ khóa cốt lõi</span>
                <span className="material-symbols-outlined text-[18px]">
                  {isHintOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {hasUsedHint && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-[11px]">
                  <span className="material-symbols-outlined text-[13px] text-score-partial">info</span>
                  Đã xem gợi ý
                </span>
              )}
            </div>

            {isHintOpen && (
              <div className="p-3.5 rounded-xl bg-surface-card border border-secondary/30 text-on-surface shadow-xs animate-in fade-in duration-150">
                <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                  <strong className="text-secondary font-bold">Gợi ý vàng: </strong>
                  {currentQuestion.hintWords}
                </p>
              </div>
            )}
          </div>

          {/* TẦNG 3: ĐÁP ÁN CHUẨN GIÁO TRÌNH */}
          <div className="p-space-md bg-surface-card flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-mastered/10 text-status-mastered font-bold text-label-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Tầng 3: Đáp án chuẩn giáo trình
              </span>

              <button
                onClick={() => setIsAnswerOpen(!isAnswerOpen)}
                className="font-label-sm text-label-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
              >
                {isAnswerOpen ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
            </div>

            {isAnswerOpen && (
              <div className="flex flex-col gap-space-sm animate-in fade-in duration-150">
                {/* Segmented Selector for Easy / Full View */}
                <div className="flex p-1 bg-surface-subtle rounded-xl border border-border-subtle gap-1">
                  <button
                    type="button"
                    onClick={() => setAnswerTab('easy')}
                    className={`flex-1 py-2 px-3 rounded-lg text-center font-bold text-label-md transition-all active:scale-95 ${
                      answerTab === 'easy'
                        ? 'bg-surface-card text-primary shadow-xs border border-border-subtle'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Bản tóm lược dễ thuộc
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswerTab('full')}
                    className={`flex-1 py-2 px-3 rounded-lg text-center font-bold text-label-md transition-all active:scale-95 ${
                      answerTab === 'full'
                        ? 'bg-surface-card text-primary shadow-xs border border-border-subtle'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Nguyên văn chi tiết
                  </button>
                </div>

                {/* TAB 1: BẢN TÓM LƯỢC DỄ THUỘC */}
                {answerTab === 'easy' && (
                  <div className="flex flex-col gap-3">
                    {/* Mandated core quote card with golden tactile frame */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-secondary-fixed via-surface-card to-secondary-fixed/40 border-2 border-secondary/30 flex flex-col gap-1.5 shadow-xs">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">bookmark</span>
                        Ý cốt tử bắt buộc phải thuộc
                      </span>
                      <p className={`font-bold text-on-surface ${textClass}`}>
                        {currentQuestion.easyAnswer.headlineQuote}
                      </p>
                    </div>

                    {/* Mnemonic / Memory tip banner */}
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <span className="material-symbols-outlined text-[16px]">psychology</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-label-sm uppercase text-primary">Mẹo nhớ nhanh:</span>
                        <p className={`text-on-surface font-semibold ${textClass}`}>
                          {currentQuestion.easyAnswer.mnemonic}
                        </p>
                      </div>
                    </div>

                    {/* Visual details for Question 1 */}
                    {currentQuestion.visualDetails?.fourColors && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {currentQuestion.visualDetails.fourColors.map((c, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-surface-subtle border border-border-subtle flex items-start gap-2">
                            <span className={`w-3.5 h-3.5 rounded-full ${c.colorClass} shrink-0 mt-0.5`} />
                            <div className="text-xs text-on-surface leading-snug">
                              <strong className="block font-bold">{c.name}:</strong>
                              <span>{c.meaning}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: NGUYÊN VĂN CHI TIẾT */}
                {answerTab === 'full' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary">
                        <span className="material-symbols-outlined text-[18px]">menu_book</span>
                        <span>Nghe đọc toàn văn nguyên văn</span>
                      </div>
                      <button
                        onClick={() => {
                          const fullText = [
                            currentQuestion.fullAnswer.intro,
                            currentQuestion.fullAnswer.quote,
                            ...currentQuestion.fullAnswer.paragraphs
                          ].filter(Boolean).join('. ');
                          handleSpeak(fullText, `/audio/q${currentQuestion.id}_full.mp3`);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 shadow-xs ${
                          isSpeaking
                            ? 'bg-score-forgot text-white'
                            : 'bg-primary text-on-primary hover:brightness-105'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isSpeaking ? 'stop' : 'volume_up'}
                        </span>
                        <span>{isSpeaking ? 'Dừng đọc' : 'Nghe toàn bài'}</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-subtle text-on-surface flex flex-col gap-3 border border-border-subtle">
                      <p className="font-bold text-primary text-[16px]">{currentQuestion.fullAnswer.intro}</p>

                      {currentQuestion.fullAnswer.quote && (
                        <blockquote className="pl-3.5 pr-2 py-2 italic font-semibold text-on-surface bg-surface-card p-2.5 rounded-xl border-l-4 border-primary shadow-xs">
                          {currentQuestion.fullAnswer.quote}
                        </blockquote>
                      )}

                      {currentQuestion.fullAnswer.paragraphs.map((p, idx) => (
                        <div key={idx} className={`p-3 bg-surface-card rounded-xl border border-border-subtle/80 text-on-surface whitespace-pre-line leading-relaxed shadow-xs ${textClass}`}>
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hint Penalty Warning Toast */}
      {showHintWarning && (
        <div className="mb-2 p-3 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center gap-2 text-xs font-bold border border-secondary/30 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px] text-secondary">info</span>
          <span>Bạn đã mở xem gợi ý ở Tầng 2, câu này được giới hạn tối đa 1 điểm!</span>
        </div>
      )}

      {/* THUMB-ZONE SELF-ASSESSMENT (3 BIG TACTILE BUTTONS) */}
      <div className="flex flex-col gap-2 mb-space-md bg-surface-card p-3 rounded-2xl border border-border-subtle shadow-xs">
        <div className="flex items-center justify-between px-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">
            Tự đánh giá phản xạ nhớ
          </span>
          <span className="font-label-sm text-label-sm font-bold text-primary">
            {selectedScore !== null ? `Đã chọn: ${selectedScore} điểm` : 'Chạm để chấm điểm'}
          </span>
        </div>

        {/* 3-way Split Responsive Button Array */}
        <div className="grid grid-cols-3 gap-2">
          {/* 0 Điểm - Quên */}
          <button
            type="button"
            onClick={() => handleSelectScore(0)}
            className={`h-14 px-2 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 shadow-xs border ${
              selectedScore === 0
                ? 'bg-score-forgot text-white border-score-forgot scale-[1.02] shadow-sm'
                : 'bg-surface-card text-score-forgot border-score-forgot/30 hover:bg-score-forgot/5'
            }`}
          >
            <div className="flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[18px]">replay</span>
              <span className="text-[17px]">0đ</span>
            </div>
            <span className="text-[11px] font-bold">Quên</span>
          </button>

          {/* 1 Điểm - Nhớ một phần */}
          <button
            type="button"
            onClick={() => handleSelectScore(1)}
            className={`h-14 px-2 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 shadow-xs border ${
              selectedScore === 1
                ? 'bg-score-partial text-white border-score-partial scale-[1.02] shadow-sm'
                : 'bg-surface-card text-score-partial border-score-partial/30 hover:bg-score-partial/5'
            }`}
          >
            <div className="flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[18px]">autorenew</span>
              <span className="text-[17px]">1đ</span>
            </div>
            <span className="text-[11px] font-bold">Nhớ một phần</span>
          </button>

          {/* 2 Điểm - Thuộc làu */}
          <button
            type="button"
            onClick={() => handleSelectScore(2)}
            title={hasUsedHint ? 'Đã xem gợi ý: tối đa 1 điểm' : 'Thuộc làu 2 điểm'}
            className={`h-14 px-2 rounded-xl flex flex-col items-center justify-center transition-all active:scale-95 shadow-xs border ${
              hasUsedHint
                ? 'opacity-40 bg-surface-subtle border-border-subtle cursor-not-allowed text-status-mastered'
                : selectedScore === 2
                ? 'bg-status-mastered text-white border-status-mastered scale-[1.02] shadow-sm'
                : 'bg-surface-card text-status-mastered border-status-mastered/30 hover:bg-status-mastered/5'
            }`}
          >
            <div className="flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span className="text-[17px]">2đ</span>
            </div>
            <span className={`text-[11px] font-bold ${hasUsedHint ? 'line-through' : ''}`}>
              {hasUsedHint ? 'Đã khóa' : 'Thuộc làu'}
            </span>
          </button>
        </div>
      </div>

      {/* Primary Action Button: Câu tiếp theo */}
      <button
        type="button"
        onClick={handleNextQuestion}
        className="w-full h-13 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-[16px] flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 hover:brightness-105"
      >
        <span>Chuyển sang câu tiếp theo</span>
        <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
      </button>
    </div>
  );
};
