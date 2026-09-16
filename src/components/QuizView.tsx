import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  Filter
} from 'lucide-react';
import { NCLEXQuestion, QuestionCategory } from '../types';
import { getRandomQuestions, nclexQuestions } from '../data/nclexData';
import { soundEngine } from '../utils/audio';

interface QuizViewProps {
  onRecordAnswer: (category: string, isCorrect: boolean) => void;
  onRecordQuizSession: (score: number, total: number, category: string) => void;
  soundEnabled: boolean;
  onNavigateToFlashcards: () => void;
  onNavigateToDashboard: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  onRecordAnswer,
  onRecordQuizSession,
  soundEnabled,
  onNavigateToFlashcards,
  onNavigateToDashboard
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [questions, setQuestions] = useState<NCLEXQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [sessionAnswers, setSessionAnswers] = useState<
    Array<{
      question: NCLEXQuestion;
      selectedIndex: number;
      isCorrect: boolean;
    }>
  >([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);

  // Initialize a new 5-question session
  const startNewQuiz = (category: string = selectedCategory) => {
    const fresh = getRandomQuestions(5, category === 'All' ? undefined : category);
    setQuestions(fresh);
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setIsSubmitted(false);
    setShowHint(false);
    setSessionAnswers([]);
    setIsCompleted(false);
    setExpandedReviewId(null);
  };

  useEffect(() => {
    startNewQuiz(selectedCategory);
  }, [selectedCategory]);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return; // Prevent changing after submission
    setSelectedOptionIndex(idx);
    setIsSubmitted(true);

    const isCorrect = currentQuestion.options[idx].isCorrect;

    // Audio feedback
    if (isCorrect) {
      soundEngine.playCorrect(soundEnabled);
    } else {
      soundEngine.playIncorrect(soundEnabled);
    }

    // Persist single answer metric
    onRecordAnswer(currentQuestion.category, isCorrect);

    // Save in current session answers
    setSessionAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion,
        selectedIndex: idx,
        isCorrect
      }
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsSubmitted(false);
      setShowHint(false);
    } else {
      // Complete quiz
      const correctCount = sessionAnswers.filter((a) => a.isCorrect).length;
      onRecordQuizSession(
        correctCount,
        questions.length,
        selectedCategory === 'All' ? 'Mixed High-Yield' : selectedCategory
      );
      setIsCompleted(true);
    }
  };

  const categories: Array<{ id: string; label: string }> = [
    { id: 'All', label: 'All High-Yield' },
    { id: 'Prioritization', label: 'Prioritization & ABCs' },
    { id: 'Pharmacology', label: 'Pharmacology' },
    { id: 'Safe & Effective Care', label: 'Safe Care & Delegation' }
  ];

  if (!currentQuestion && !isCompleted) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Loading Quick Quiz...</h3>
        <p className="text-slate-500 text-sm mt-1">Preparing 5 high-yield clinical questions.</p>
      </div>
    );
  }

  // --- RESULTS SCREEN ---
  if (isCompleted) {
    const total = questions.length;
    const correctCount = sessionAnswers.filter((a) => a.isCorrect).length;
    const percentage = Math.round((correctCount / total) * 100);

    return (
      <div className="max-w-xl mx-auto px-4 py-6 pb-24 space-y-6 animate-fadeIn">
        {/* Score Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mb-4">
            <Award className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            5-Question Micro Drill Complete
          </span>

          <h2 className="text-2xl font-black text-slate-900">
            {percentage >= 80
              ? 'Excellent Clinical Judgment!'
              : percentage >= 60
              ? 'Good Effort! Keep Reinforcing'
              : 'Review Rationales to Build Mastery'}
          </h2>

          <p className="text-sm text-slate-600 mt-1">
            You scored <span className="font-bold text-slate-900">{correctCount}</span> out of{' '}
            <span className="font-bold text-slate-900">{total}</span> questions ({percentage}%).
          </p>

          {/* Metric Bar */}
          <div className="mt-5 w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                percentage >= 80
                  ? 'bg-emerald-500'
                  : percentage >= 60
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => startNewQuiz(selectedCategory)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Give Me 5 More Questions
            </button>
            <button
              onClick={onNavigateToFlashcards}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              Practice Flashcards
            </button>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Detailed Question Review ({sessionAnswers.length})
            </h3>
            <span className="text-xs text-slate-500">Tap to inspect rationale</span>
          </div>

          {sessionAnswers.map((item, idx) => {
            const isExpanded = expandedReviewId === item.question.id;
            return (
              <div
                key={item.question.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setExpandedReviewId(isExpanded ? null : item.question.id)}
                  className="w-full text-left p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={`mt-0.5 w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                      item.isCorrect
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {item.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-500">Q{idx + 1}</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {item.question.category}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 line-clamp-2">
                      {item.question.question}
                    </p>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-3 bg-slate-50/50">
                    {/* User Selection vs Correct */}
                    <div className="space-y-1.5 text-xs">
                      <div className="p-2.5 rounded-lg border border-slate-200 bg-white">
                        <span className="font-bold text-slate-500 block mb-0.5">Your Answer:</span>
                        <span
                          className={`font-semibold ${
                            item.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {item.question.options[item.selectedIndex]?.text}
                        </span>
                      </div>

                      {!item.isCorrect && (
                        <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900">
                          <span className="font-bold text-emerald-800 block mb-0.5">
                            Correct Answer:
                          </span>
                          <span className="font-semibold">
                            {item.question.options.find((o) => o.isCorrect)?.text}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Detailed Rationale */}
                    <div className="p-3 rounded-lg bg-sky-50/80 border border-sky-200/80 text-xs text-slate-800 leading-relaxed">
                      <span className="font-bold text-sky-900 block mb-1">
                        Clinical Rationale:
                      </span>
                      {item.question.rationale}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- ACTIVE QUIZ QUESTION VIEW ---
  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 space-y-4">
      {/* Category Pills Header */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Progress & Question Counter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
              {currentQuestion.category}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Hint Trigger Button */}
          <button
            onClick={() => setShowHint(!showHint)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
              showHint
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{showHint ? 'Hide Hint' : 'Hint (Clinical Logic)'}</span>
          </button>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-sky-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Clinical Judgment Hint Banner */}
        {showHint && (
          <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 leading-relaxed animate-fadeIn">
            <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              Clinical Judgment Framework Cue:
            </div>
            <p className="font-medium">{currentQuestion.hint}</p>
          </div>
        )}

        {/* Question Text */}
        <div className="pt-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentQuestion.question}
          </h2>
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-2.5">
        {currentQuestion.options.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C, D
          const isSelected = selectedOptionIndex === idx;
          const showResult = isSubmitted;
          const isCorrect = option.isCorrect;

          let btnStyles =
            'bg-white border-slate-200 text-slate-800 hover:border-sky-300 hover:bg-sky-50/30';
          let letterStyles = 'bg-slate-100 text-slate-700 border-slate-200';

          if (showResult) {
            if (isCorrect) {
              btnStyles = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold shadow-xs';
              letterStyles = 'bg-emerald-600 text-white border-emerald-600';
            } else if (isSelected && !isCorrect) {
              btnStyles = 'bg-rose-50 border-rose-300 text-rose-950 font-medium';
              letterStyles = 'bg-rose-600 text-white border-rose-600';
            } else {
              btnStyles = 'bg-slate-50/70 border-slate-200 text-slate-400 opacity-60';
              letterStyles = 'bg-slate-200 text-slate-500 border-slate-300';
            }
          }

          return (
            <button
              key={idx}
              disabled={isSubmitted}
              onClick={() => handleSelectOption(idx)}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-150 flex items-start gap-3 cursor-pointer shadow-2xs ${btnStyles}`}
            >
              <span
                className={`w-7 h-7 rounded-lg border flex-shrink-0 flex items-center justify-center text-xs font-bold transition-colors ${letterStyles}`}
              >
                {showResult && isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : showResult && isSelected && !isCorrect ? (
                  <XCircle className="w-4 h-4 text-white" />
                ) : (
                  letter
                )}
              </span>
              <span className="flex-1 text-sm pt-0.5 leading-relaxed">{option.text}</span>
            </button>
          );
        })}
      </div>

      {/* Rationale & Next Action */}
      {isSubmitted && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4 animate-fadeIn">
          <div
            className={`p-3.5 rounded-xl border leading-relaxed text-xs sm:text-sm ${
              currentQuestion.options[selectedOptionIndex!]?.isCorrect
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/80 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold mb-1">
              {currentQuestion.options[selectedOptionIndex!]?.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-800">Correct Answer</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span className="text-rose-800">Incorrect Choice</span>
                </>
              )}
            </div>
            <div className="text-slate-800 pt-1">
              <span className="font-bold text-slate-900 block mb-0.5">Clinical Rationale:</span>
              {currentQuestion.rationale}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span>
              {currentIndex + 1 < questions.length ? 'Next Question' : 'View Drill Results'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
