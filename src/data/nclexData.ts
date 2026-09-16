import rawData from './data.json';
import { NCLEXQuestion, Flashcard, CheatSheetEntry } from '../types';

export const nclexQuestions: NCLEXQuestion[] = rawData.questions as NCLEXQuestion[];
export const flashcardsData: Flashcard[] = rawData.flashcards as Flashcard[];
export const cheatSheetEntries: CheatSheetEntry[] = ((rawData as any).cheatSheet || []) as CheatSheetEntry[];

// Helper to draw 5 random unique questions from data
export function getRandomQuestions(count: number = 5, categoryFilter?: string): NCLEXQuestion[] {
  let pool = [...nclexQuestions];
  if (categoryFilter && categoryFilter !== 'All') {
    pool = pool.filter((q) => q.category === categoryFilter);
  }
  // If pool has fewer than requested, return all in pool shuffled
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
