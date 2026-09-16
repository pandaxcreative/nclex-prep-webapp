import React, { useState } from 'react';
import {
  RotateCw,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Bookmark,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { Flashcard, FlashcardType } from '../types';
import { flashcardsData } from '../data/nclexData';
import { soundEngine } from '../utils/audio';

interface FlashcardsViewProps {
  masteredIds: number[];
  onToggleMastery: (id: number) => void;
  soundEnabled: boolean;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  masteredIds,
  onToggleMastery,
  soundEnabled
}) => {
  const [activeType, setActiveType] = useState<string>('All');
  const [cards, setCards] = useState<Flashcard[]>(flashcardsData);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Filtered list
  const filteredCards =
    activeType === 'All'
      ? cards
      : cards.filter((c) => c.type === activeType);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredCards.length - 1));
  const currentCard = filteredCards[safeIndex];

  const handleFlip = () => {
    soundEngine.playFlip(soundEnabled);
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (safeIndex + 1 < filteredCards.length) {
      setCurrentIndex(safeIndex + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    } else {
      setCurrentIndex(filteredCards.length - 1);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => 0.5 - Math.random());
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    setIsFlipped(false);
    setCurrentIndex(0);
  };

  const cardTypes = [
    'All',
    'Lab Value',
    'Drug Suffix',
    'Therapeutic Level',
    'Emergency Antidote'
  ];

  const isMastered = currentCard ? masteredIds.includes(currentCard.id) : false;
  const totalMasteredInFilter = filteredCards.filter((c) =>
    masteredIds.includes(c.id)
  ).length;

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 space-y-4">
      {/* Category Pills Header */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {cardTypes.map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeType === type
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {type === 'All' ? 'All Cards' : type + 's'}
          </button>
        ))}
      </div>

      {/* Progress & Tools Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            Card {filteredCards.length > 0 ? safeIndex + 1 : 0} of {filteredCards.length}
          </span>
          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
            {totalMasteredInFilter} Mastered
          </span>
        </div>

        <button
          onClick={handleShuffle}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5 text-slate-500" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* 3D Flip Card Container */}
      {currentCard ? (
        <div className="perspective-1000 w-full min-h-[320px] sm:min-h-[340px] select-none">
          <div
            onClick={handleFlip}
            className={`relative w-full h-full min-h-[320px] sm:min-h-[340px] rounded-2xl cursor-pointer transition-transform duration-500 transform-style-3d shadow-sm hover:shadow-md ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT OF CARD */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
                  {currentCard.type}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMastery(currentCard.id);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    isMastered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200'
                  }`}
                >
                  <CheckCircle2
                    className={`w-3.5 h-3.5 ${
                      isMastered ? 'text-emerald-600 fill-emerald-600 text-white' : ''
                    }`}
                  />
                  <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                </button>
              </div>

              {/* Front Content (Prompt) */}
              <div className="my-auto py-4 text-center">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">
                  Prompt
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                  {currentCard.front}
                </h3>
              </div>

              {/* Tap to Flip Footer */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium pt-2 border-t border-slate-100">
                <RotateCw className="w-3.5 h-3.5 animate-spin-reverse" />
                <span>Tap card to reveal answer</span>
              </div>
            </div>

            {/* BACK OF CARD */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-linear-to-b from-sky-50 to-white border-2 border-sky-300 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
              {/* Back Header */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800">
                  {currentCard.type}
                </span>
                <span className="text-xs font-bold text-sky-700">Answer</span>
              </div>

              {/* Back Content (Answer & High Yield Notes) */}
              <div className="my-auto py-2 text-center space-y-3">
                <h4 className="text-2xl sm:text-3xl font-black text-sky-950 leading-tight whitespace-pre-line font-mono">
                  {currentCard.back}
                </h4>

                {currentCard.notes && (
                  <div className="max-w-md mx-auto p-3 rounded-xl bg-white/90 border border-sky-200 text-xs text-slate-700 leading-relaxed text-left shadow-2xs">
                    <span className="font-bold text-sky-900 block mb-0.5 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-sky-600" />
                      High-Yield Clinical Note:
                    </span>
                    {currentCard.notes}
                  </div>
                )}
              </div>

              {/* Tap to Flip Back Footer */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-sky-600 font-semibold pt-2 border-t border-sky-100">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Tap to flip back</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-slate-500 text-sm">No flashcards found in this category.</p>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrev}
          className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleFlip}
          className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <RotateCw className="w-4 h-4 text-slate-600" />
          <span>Flip</span>
        </button>

        <button
          onClick={handleNext}
          className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mastery Toggle Button for current card */}
      {currentCard && (
        <div className="pt-1">
          <button
            onClick={() => onToggleMastery(currentCard.id)}
            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isMastered
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2
              className={`w-4 h-4 ${
                isMastered ? 'text-emerald-600 fill-emerald-600 text-white' : 'text-slate-400'
              }`}
            />
            <span>
              {isMastered
                ? 'Card is Mastered (Click to move back to study list)'
                : 'Mark as Mastered (Move to completed knowledge pool)'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
