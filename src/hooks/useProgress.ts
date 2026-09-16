import { useState, useEffect } from 'react';
import { UserProgress } from '../types';

const STORAGE_KEY = 'nclex_micro_prep_user_progress_v1';

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getYesterdayString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const DEFAULT_PROGRESS: UserProgress = {
  totalAnswered: 0,
  correctAnswers: 0,
  currentStreak: 1,
  bestStreak: 1,
  lastActiveDate: getTodayString(),
  masteredFlashcards: [],
  soundEnabled: true,
  categoryStats: {},
  recentQuizzes: []
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: UserProgress = JSON.parse(stored);
        // Check streak expiration upon initial load
        const today = getTodayString();
        const yesterday = getYesterdayString();
        
        let currentStreak = parsed.currentStreak || 0;
        if (parsed.lastActiveDate && parsed.lastActiveDate !== today && parsed.lastActiveDate !== yesterday) {
          // Inactivity broke the streak
          currentStreak = 0;
        }

        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          currentStreak
        };
      }
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    }
    return DEFAULT_PROGRESS;
  });

  // Save to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to persist progress', e);
    }
  }, [progress]);

  // Touch activity to update streak
  const touchActivity = () => {
    const today = getTodayString();
    const yesterday = getYesterdayString();

    setProgress((prev) => {
      if (prev.lastActiveDate === today) {
        return prev;
      }

      let newStreak = 1;
      if (prev.lastActiveDate === yesterday) {
        newStreak = (prev.currentStreak || 0) + 1;
      }

      return {
        ...prev,
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak || 0, newStreak),
        lastActiveDate: today
      };
    });
  };

  // Record a batch of question answers (e.g. from quiz)
  const recordQuestionAnswer = (category: string, isCorrect: boolean) => {
    touchActivity();
    setProgress((prev) => {
      const currentCat = prev.categoryStats[category] || { answered: 0, correct: 0 };
      const updatedCategoryStats = {
        ...prev.categoryStats,
        [category]: {
          answered: currentCat.answered + 1,
          correct: currentCat.correct + (isCorrect ? 1 : 0)
        }
      };

      return {
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        categoryStats: updatedCategoryStats
      };
    });
  };

  // Record a completed 5-question quiz session
  const recordQuizSession = (score: number, total: number, category: string = 'Mixed High-Yield') => {
    touchActivity();
    setProgress((prev) => {
      const newHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
        score,
        total,
        category
      };

      return {
        ...prev,
        recentQuizzes: [newHistoryItem, ...prev.recentQuizzes].slice(0, 10)
      };
    });
  };

  // Toggle flashcard mastery
  const toggleFlashcardMastery = (cardId: number) => {
    touchActivity();
    setProgress((prev) => {
      const isMastered = prev.masteredFlashcards.includes(cardId);
      const newMastered = isMastered
        ? prev.masteredFlashcards.filter((id) => id !== cardId)
        : [...prev.masteredFlashcards, cardId];

      return {
        ...prev,
        masteredFlashcards: newMastered
      };
    });
  };

  // Toggle sound
  const toggleSound = () => {
    setProgress((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled
    }));
  };

  // Reset progress
  const resetProgress = () => {
    const fresh: UserProgress = {
      ...DEFAULT_PROGRESS,
      lastActiveDate: getTodayString()
    };
    setProgress(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch (e) {
      console.error(e);
    }
  };

  return {
    progress,
    recordQuestionAnswer,
    recordQuizSession,
    toggleFlashcardMastery,
    toggleSound,
    resetProgress,
    touchActivity
  };
}
