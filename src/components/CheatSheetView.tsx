import React, { useState } from 'react';
import { Search, BookOpen, CheckCircle, Lightbulb, Bookmark, ArrowRight } from 'lucide-react';
import { cheatSheetEntries } from '../data/nclexData';
import { CheatSheetEntry } from '../types';

export const CheatSheetView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Priority Rules', 'Essential Mnemonics'];

  const filteredEntries = cheatSheetEntries.filter((entry) => {
    const matchesCategory =
      selectedCategory === 'All' || entry.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      entry.title.toLowerCase().includes(query) ||
      entry.summary.toLowerCase().includes(query) ||
      entry.clinicalRule.toLowerCase().includes(query) ||
      entry.examples.some((ex) => ex.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 space-y-4">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-sky-600 to-sky-700 text-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-sky-200" />
          <h2 className="text-lg font-extrabold tracking-tight">NCLEX High-Yield Cheat Sheet</h2>
        </div>
        <p className="text-xs text-sky-100 leading-relaxed">
          Memorize the core prioritization principles, clinical judgment rules, and critical test-taking mnemonics.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-2.5">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, rules, or mnemonics..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
        <span>Showing {filteredEntries.length} high-yield reference items</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-sky-600 hover:underline cursor-pointer"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Cheat Sheet Items List */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <article
            key={entry.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
          >
            {/* Entry Header */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {entry.title}
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 whitespace-nowrap">
                {entry.category}
              </span>
            </div>

            {/* Summary */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {entry.summary}
            </p>

            {/* Clinical Rule Box */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line font-mono">
              <span className="font-bold text-slate-900 block mb-1 font-sans">
                Core Clinical Rule:
              </span>
              {entry.clinicalRule}
            </div>

            {/* Clinical Examples */}
            {entry.examples && entry.examples.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  NCLEX Application Examples
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {entry.examples.map((ex, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-sky-500 font-bold">•</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Key Takeaway Badge */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>{entry.keyTakeaway}</span>
            </div>
          </article>
        ))}

        {filteredEntries.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-slate-600 text-sm font-medium">
              No matching keywords found for "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 px-4 py-2 text-xs font-bold text-sky-600 hover:text-sky-700"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
