import React from 'react';
import { LayoutDashboard, CheckSquare, Layers, BookOpen } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'quiz', label: '5-Q Drill', icon: CheckSquare },
    { id: 'flashcards', label: 'Flashcards', icon: Layers },
    { id: 'cheatsheet', label: 'Cheat Sheet', icon: BookOpen }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 safe-area-pb shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-4 px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-150 relative ${
                isActive
                  ? 'text-sky-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform duration-150 ${
                  isActive ? 'scale-110 bg-sky-50 text-sky-600' : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] tracking-tight mt-0.5 whitespace-nowrap">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-sky-600" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
