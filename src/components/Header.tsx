import React from 'react';
import { Flame, Volume2, VolumeX, Stethoscope, Sparkles } from 'lucide-react';
import { UserProgress, ActiveTab } from '../types';

interface HeaderProps {
  progress: UserProgress;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  setActiveTab,
  onToggleSound
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo & Brand */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs group-hover:bg-sky-700 transition-colors">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-slate-900 text-base">
                NCLEX
              </span>
              <span className="font-bold text-sky-600 text-base">Micro-Prep</span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                RN
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden xs:block">
              High-Yield Clinical Drills
            </p>
          </div>
        </button>

        {/* Right Action Badges */}
        <div className="flex items-center gap-2">
          {/* Daily Streak Indicator */}
          <div
            title={`${progress.currentStreak} Day Study Streak`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-xs cursor-default"
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{progress.currentStreak} {progress.currentStreak === 1 ? 'day' : 'days'}</span>
          </div>

          {/* Sound Mute/Unmute */}
          <button
            onClick={onToggleSound}
            aria-label={progress.soundEnabled ? 'Mute audio' : 'Unmute audio'}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border ${
              progress.soundEnabled
                ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
          >
            {progress.soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
