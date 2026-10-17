/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_QUESTIONS, QuestionData, QuestionStatus } from './data/questions';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { StudyView, StudySubMode } from './components/StudyView';
import { QuestionsView } from './components/QuestionsView';
import { ExamView } from './components/ExamView';
import { MistakeNotebookView } from './components/MistakeNotebookView';
import { ResetModal } from './components/ResetModal';
import { ProfileModal } from './components/ProfileModal';
import { storage } from './utils/storage';

export default function App() {
  // Load questions from local storage or fallback
  const [questions, setQuestions] = useState<QuestionData[]>(() => {
    try {
      const saved = localStorage.getItem('vovinam_questions_v3');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_QUESTIONS;
  });

  const [currentDay, setCurrentDay] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('vovinam_current_day');
      if (saved) return parseInt(saved, 10);
    } catch {
      // ignore
    }
    return 3;
  });

  const [streakDays, setStreakDays] = useState<number>(3);
  const daysRemaining = Math.max(0, 10 - currentDay);

  const [currentTab, setCurrentTab] = useState<TabType>('trang-chu');
  const [targetStudyQuestionId, setTargetStudyQuestionId] = useState<number>(1);
  const [targetStudySubMode, setTargetStudySubMode] = useState<StudySubMode>('overview');

  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Hydrate from native iOS storage (UserDefaults) on launch
  useEffect(() => {
    const hydrate = async () => {
      try {
        const savedQ = await storage.getItem('vovinam_questions_v3');
        if (savedQ) {
          const parsed = JSON.parse(savedQ);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setQuestions(parsed);
          }
        }
        const savedDay = await storage.getItem('vovinam_current_day');
        if (savedDay) {
          setCurrentDay(parseInt(savedDay, 10));
        }
      } catch {
        // ignore
      }
    };
    hydrate();
  }, []);

  // Flush to storage whenever app goes into background or is closed
  useEffect(() => {
    const flushData = () => {
      storage.setItem('vovinam_questions_v3', JSON.stringify(questions));
      storage.setItem('vovinam_current_day', currentDay.toString());
    };

    window.addEventListener('beforeunload', flushData);
    window.addEventListener('pagehide', flushData);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', flushData);
      window.removeEventListener('pagehide', flushData);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [questions, currentDay]);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as TabType;
      if (['trang-chu', 'hoc-bai', '10-cau-hoi', 'so-tay', 'thi-thu'].includes(hash)) {
        setCurrentTab(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when tab changes
  const handleSelectTab = (tab: TabType) => {
    setCurrentTab(tab);
    window.location.hash = `#${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to persist questions to both localStorage and native iOS UserDefaults
  const saveQuestions = (updated: QuestionData[]) => {
    storage.setItem('vovinam_questions_v3', JSON.stringify(updated));
  };

  // Save questions score
  const handleUpdateQuestionScore = (id: number, score: number) => {
    setQuestions((prev) => {
      const updated = prev.map((q) => {
        if (q.id === id) {
          let newStatus: QuestionStatus = q.status;
          if (score === 2) newStatus = 'mastered';
          else if (score === 1) newStatus = 'learning';
          else if (score === 0) newStatus = 'review';

          return {
            ...q,
            score,
            status: newStatus,
            readCount: (q.readCount || 0) + 1,
          };
        }
        return q;
      });

      saveQuestions(updated);
      return updated;
    });
  };

  // Toggle bookmark in mistake notebook
  const handleToggleBookmark = (id: number) => {
    setQuestions((prev) => {
      const updated = prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            isBookmarked: !q.isBookmarked,
          };
        }
        return q;
      });
      saveQuestions(updated);
      return updated;
    });
  };

  // Update user's personal mistake note
  const handleUpdateUserNote = (id: number, note: string) => {
    setQuestions((prev) => {
      const updated = prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            userNote: note,
          };
        }
        return q;
      });
      saveQuestions(updated);
      return updated;
    });
  };

  const handleStartStudy = (targetId?: number, subMode: StudySubMode = 'overview') => {
    if (targetId) {
      setTargetStudyQuestionId(targetId);
    }
    setTargetStudySubMode(subMode);
    handleSelectTab('hoc-bai');
  };

  const handleStartExam = () => {
    handleSelectTab('thi-thu');
  };

  const handlePracticeSingle = (id: number, subMode: StudySubMode = 'overview') => {
    setTargetStudyQuestionId(id);
    setTargetStudySubMode(subMode);
    handleSelectTab('hoc-bai');
  };

  const handlePracticeFromMistakes = (id: number, subMode: StudySubMode = 'overview') => {
    setTargetStudyQuestionId(id);
    setTargetStudySubMode(subMode);
    handleSelectTab('hoc-bai');
  };

  const handleSetCurrentDay = (day: number) => {
    setCurrentDay(day);
    storage.setItem('vovinam_current_day', day.toString());
  };

  const handleResetProgress = () => {
    setQuestions(INITIAL_QUESTIONS);
    setCurrentDay(3);
    setStreakDays(3);
    storage.removeItem('vovinam_questions_v3');
    storage.removeItem('vovinam_current_day');
  };

  const mistakeCount = questions.filter(
    (q) => q.score === 0 || q.score === 1 || q.isBookmarked
  ).length;

  return (
    <div className="bg-surface-bg text-on-surface font-sans flex flex-col min-h-screen selection:bg-blue-200">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        currentDay={currentDay}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-[calc(env(safe-area-inset-top,0px)+4.75rem)] pb-[calc(env(safe-area-inset-bottom,0px)+5.5rem)] bg-surface-bg flex flex-col">
        {currentTab === 'trang-chu' && (
          <HomeView
            questions={questions}
            currentDay={currentDay}
            streakDays={streakDays}
            daysRemaining={daysRemaining}
            onStartStudy={handleStartStudy}
            onStartExam={handleStartExam}
            onSelectDay={handleSetCurrentDay}
            onOpenMistakes={() => handleSelectTab('so-tay')}
          />
        )}

        {currentTab === 'hoc-bai' && (
          <StudyView
            questions={questions}
            initialQuestionId={targetStudyQuestionId}
            initialSubMode={targetStudySubMode}
            onUpdateQuestionScore={handleUpdateQuestionScore}
            onToggleBookmark={handleToggleBookmark}
            onFinishStudySession={() => handleSelectTab('trang-chu')}
          />
        )}

        {currentTab === '10-cau-hoi' && (
          <QuestionsView
            questions={questions}
            onPracticeSingle={handlePracticeSingle}
          />
        )}

        {currentTab === 'so-tay' && (
          <MistakeNotebookView
            questions={questions}
            onPracticeQuestion={handlePracticeFromMistakes}
            onUpdateQuestionScore={handleUpdateQuestionScore}
            onToggleBookmark={handleToggleBookmark}
            onUpdateUserNote={handleUpdateUserNote}
          />
        )}

        {currentTab === 'thi-thu' && (
          <ExamView
            questions={questions}
            onFinishExam={() => {}}
            onGoHome={() => handleSelectTab('trang-chu')}
            onGoStudyWeak={() => handleSelectTab('hoc-bai')}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        mistakeCount={mistakeCount}
      />

      {/* Modals */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        currentDay={currentDay}
        onSetCurrentDay={handleSetCurrentDay}
        onResetProgress={handleResetProgress}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentDay={currentDay}
        streakDays={streakDays}
        daysRemaining={daysRemaining}
      />
    </div>
  );
}
