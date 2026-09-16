export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export type QuestionCategory =
  | 'Prioritization'
  | 'Pharmacology'
  | 'Safe & Effective Care'
  | 'Physiological Adaptation'
  | 'Reduction of Risk'
  | 'Maternal & Newborn';

export interface NCLEXQuestion {
  id: number;
  category: QuestionCategory;
  question: string;
  options: QuestionOption[];
  rationale: string;
  hint: string;
  frameworkTag?: string; // e.g., 'ABC Rule', 'ADPIE (Assess First)', 'Acute vs Chronic', 'Safety First'
}

export type FlashcardType =
  | 'Lab Value'
  | 'Drug Suffix'
  | 'Therapeutic Level'
  | 'Emergency Antidote';

export interface Flashcard {
  id: number;
  type: FlashcardType;
  front: string;
  back: string;
  notes?: string;
  category?: string;
}

export interface CheatSheetEntry {
  id: string;
  title: string;
  category: 'Priority Rules' | 'Key Vocabulary' | 'Essential Mnemonics';
  summary: string;
  clinicalRule: string;
  examples: string[];
  keyTakeaway: string;
}

export interface QuizSessionState {
  questions: NCLEXQuestion[];
  currentIndex: number;
  selectedOptionIndex: number | null;
  isAnswerSubmitted: boolean;
  score: number;
  showHint: boolean;
  userAnswers: Array<{
    questionId: number;
    selectedIndex: number;
    isCorrect: boolean;
  }>;
  isCompleted: boolean;
}

export interface UserProgress {
  totalAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // ISO format date 'YYYY-MM-DD'
  masteredFlashcards: number[]; // IDs of mastered cards
  soundEnabled: boolean;
  categoryStats: Record<
    string,
    {
      answered: number;
      correct: number;
    }
  >;
  recentQuizzes: Array<{
    id: string;
    date: string;
    score: number;
    total: number;
    category: string;
  }>;
}

export type ActiveTab = 'dashboard' | 'quiz' | 'flashcards' | 'cheatsheet';
