import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  HelpCircle,
  Layers,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  BarChart2,
  Calendar,
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';
import { UserProgress, ActiveTab } from '../types';
import { flashcardsData, nclexQuestions } from '../data/nclexData';

interface DashboardProps {
  progress: UserProgress;
  setActiveTab: (tab: ActiveTab) => void;
  onResetProgress: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  setActiveTab,
  onResetProgress
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const accuracy =
    progress.totalAnswered > 0
      ? Math.round((progress.correctAnswers / progress.totalAnswered) * 100)
      : 0;

  const totalCards = flashcardsData.length;
  const masteredCardsCount = progress.masteredFlashcards.length;
  const flashcardMasteryPercent =
    totalCards > 0 ? Math.round((masteredCardsCount / totalCards) * 100) : 0;

  const categoryList = [
    'Prioritization',
    'Pharmacology',
    'Safe & Effective Care'
  ];

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 space-y-5 animate-fadeIn">
      {/* Hero Quick Launch Card */}
      <div className="bg-linear-to-br from-sky-600 via-sky-700 to-indigo-800 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-sky-100 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ready for a quick 2-minute study session?</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Practice 5 High-Yield Questions
          </h2>

          <p className="text-xs sm:text-sm text-sky-100 max-w-md leading-relaxed">
            Prioritization, pharmacology, and clinical judgment drills with instant rationales and ABC/ADPIE hints.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => setActiveTab('quiz')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white text-sky-800 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs hover:bg-sky-50 transition-colors cursor-pointer"
            >
              <span>Give Me 5 Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('flashcards')}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-sky-900/40 hover:bg-sky-900/60 border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4 text-sky-200" />
              <span>Review Flashcards</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* AI Clinical Mentor Banner */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-black text-slate-900">
                AI Clinical Mentor & NGN Generator
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                Groq Fast LPU
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              Real-time ABC & ADPIE clinical judgment rationales, distractor breakdowns, and on-demand practice drills.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('quiz')}
          className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
        >
          Try AI Drill
        </button>
      </div>

      {/* Core Gamified Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Streak */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs text-center">
          <div className="w-8 h-8 mx-auto rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center mb-1.5">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {progress.currentStreak}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
            Day Streak
          </p>
        </div>

        {/* Questions Answered */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs text-center">
          <div className="w-8 h-8 mx-auto rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-1.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {progress.totalAnswered}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
            Answered
          </p>
        </div>

        {/* Accuracy Rate */}
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs text-center">
          <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900">
            {progress.totalAnswered > 0 ? `${accuracy}%` : '—'}
          </div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
            Accuracy
          </p>
        </div>
      </div>

      {/* Flashcard Mastery Gauge */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Flashcard Mastery</h3>
              <p className="text-[11px] text-slate-500">Lab Values, Drug Suffixes & Antidotes</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
            {masteredCardsCount} / {totalCards} ({flashcardMasteryPercent}%)
          </span>
        </div>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${flashcardMasteryPercent}%` }}
          />
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-sky-600" />
            High-Yield Category Performance
          </h3>
          <span className="text-xs text-slate-400 font-medium">Local tracking</span>
        </div>

        <div className="space-y-2.5">
          {categoryList.map((cat) => {
            const stats = progress.categoryStats[cat] || { answered: 0, correct: 0 };
            const catAccuracy =
              stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;

            return (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{cat}</span>
                  <span className="text-slate-500 font-medium">
                    {stats.answered > 0
                      ? `${stats.correct}/${stats.answered} (${catAccuracy}%)`
                      : 'Not attempted yet'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      catAccuracy >= 75
                        ? 'bg-emerald-500'
                        : catAccuracy >= 50
                        ? 'bg-amber-500'
                        : 'bg-sky-500'
                    }`}
                    style={{ width: `${stats.answered > 0 ? catAccuracy : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent 5-Q Quiz Sessions */}
      {progress.recentQuizzes.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-sky-600" />
            Recent Drill History
          </h3>

          <div className="divide-y divide-slate-100">
            {progress.recentQuizzes.slice(0, 4).map((quiz) => {
              const quizPercent = Math.round((quiz.score / quiz.total) * 100);
              return (
                <div key={quiz.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block">
                      {quiz.category}
                    </span>
                    <span className="text-slate-400 text-[11px]">{quiz.date}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-extrabold px-2 py-0.5 rounded-md ${
                        quizPercent >= 80
                          ? 'bg-emerald-50 text-emerald-700'
                          : quizPercent >= 60
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {quiz.score} / {quiz.total} ({quizPercent}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => setActiveTab('flashcards')}
          className="p-3.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-left transition-colors shadow-2xs cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
            <Layers className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Lab Values & Drugs</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">3D flip flashcard review</p>
        </button>

        <button
          onClick={() => setActiveTab('cheatsheet')}
          className="p-3.5 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-left transition-colors shadow-2xs cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <BookOpen className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Priority Cheat Sheet</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Acute vs Chronic & Rules</p>
        </button>
      </div>

      {/* Reset Progress Confirmation */}
      <div className="pt-2 text-center">
        {showResetConfirm ? (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-2">
            <p className="font-bold text-rose-900">
              Are you sure you want to reset your quiz stats and streak?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors cursor-pointer"
              >
                Yes, Reset All
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-[11px] text-slate-400 hover:text-slate-600 font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Local Progress</span>
          </button>
        )}
      </div>
    </div>
  );
};
