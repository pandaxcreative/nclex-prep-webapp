/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab } from './types';
import { useProgress } from './hooks/useProgress';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { QuizView } from './components/QuizView';
import { FlashcardsView } from './components/FlashcardsView';
import { CheatSheetView } from './components/CheatSheetView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const {
    progress,
    recordQuestionAnswer,
    recordQuizSession,
    toggleFlashcardMastery,
    toggleSound,
    resetProgress
  } = useProgress();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Top Mobile-First Header */}
      <Header
        progress={progress}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onToggleSound={toggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto">
        {activeTab === 'dashboard' && (
          <Dashboard
            progress={progress}
            setActiveTab={setActiveTab}
            onResetProgress={resetProgress}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            onRecordAnswer={recordQuestionAnswer}
            onRecordQuizSession={recordQuizSession}
            soundEnabled={progress.soundEnabled}
            onNavigateToFlashcards={() => setActiveTab('flashcards')}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsView
            masteredIds={progress.masteredFlashcards}
            onToggleMastery={toggleFlashcardMastery}
            soundEnabled={progress.soundEnabled}
          />
        )}

        {activeTab === 'cheatsheet' && <CheatSheetView />}
      </main>

      {/* Fixed Bottom Mobile Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

