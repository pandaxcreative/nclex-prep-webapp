import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Flame,
  ArrowUpDown,
  Filter,
  Layers,
  HelpCircle,
  Stethoscope,
  ShieldAlert,
  ListFilter
} from 'lucide-react';
import { cheatSheetEntries } from '../data/nclexData';
import { CheatSheetEntry } from '../types';

type SortOption = 'importance' | 'frequency' | 'alphabetical';

export const CheatSheetView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('importance');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 25;

  const categories = [
    'All',
    'Priority Rules',
    'Assessment Signs',
    'High-Alert Meds',
    'Clinical Procedures',
    'Key Vocabulary'
  ];

  const tiers = [
    'All',
    'Vital / Emergency',
    'High Frequency',
    'Standard High-Yield'
  ];

  // Filter and Sort entries
  const processedEntries = useMemo(() => {
    let result = [...cheatSheetEntries];

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter((entry) => entry.category === selectedCategory);
    }

    // Filter by Frequency Tier
    if (selectedTier !== 'All') {
      result = result.filter((entry) => entry.frequencyTier === selectedTier);
    }

    // Filter by Search Query
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      result = result.filter((entry) => {
        const titleMatch = entry.title.toLowerCase().includes(query);
        const meaningMatch = entry.meaning?.toLowerCase().includes(query) ?? false;
        const usageMatch = entry.detailedUsage?.toLowerCase().includes(query) ?? false;
        const ruleMatch = entry.clinicalRule?.toLowerCase().includes(query) ?? false;
        const alertMatch = entry.nclexAlert?.toLowerCase().includes(query) ?? false;
        const examplesMatch = entry.examples?.some((ex) => ex.toLowerCase().includes(query)) ?? false;
        return titleMatch || meaningMatch || usageMatch || ruleMatch || alertMatch || examplesMatch;
      });
    }

    // Sorting
    if (sortBy === 'importance') {
      result.sort((a, b) => (a.importanceRank ?? 999) - (b.importanceRank ?? 999));
    } else if (sortBy === 'frequency') {
      const tierWeight: Record<string, number> = {
        'Vital / Emergency': 1,
        'High Frequency': 2,
        'Standard High-Yield': 3
      };
      result.sort((a, b) => {
        const weightA = tierWeight[a.frequencyTier] ?? 4;
        const weightB = tierWeight[b.frequencyTier] ?? 4;
        if (weightA !== weightB) return weightA - weightB;
        return (a.importanceRank ?? 999) - (b.importanceRank ?? 999);
      });
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [selectedCategory, selectedTier, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(processedEntries.length / itemsPerPage));
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedEntries.slice(start, start + itemsPerPage);
  }, [processedEntries, currentPage]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAllOnPage = () => {
    const pageIds = paginatedEntries.map((e) => e.id);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const getTierBadge = (tier: string) => {
    if (tier === 'Vital / Emergency') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
          <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
          Vital / Emergency
        </span>
      );
    }
    if (tier === 'High Frequency') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
          <Sparkles className="w-3 h-3 text-amber-500" />
          High Frequency
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
        <BookOpen className="w-3 h-3 text-sky-500" />
        Standard High-Yield
      </span>
    );
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 space-y-4 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-sky-700 via-sky-800 to-indigo-900 text-white rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-300" />
            <h2 className="text-lg font-black tracking-tight">NCLEX High-Yield Cheat Sheet</h2>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
            {cheatSheetEntries.length} Concepts
          </span>
        </div>
        <p className="text-xs text-sky-100 leading-relaxed">
          Sınavda en çok çıkan 500+ terim, öncelik kuralı ve klinik müdahale. Önem sırasına ve kullanım sıklığına göre sıralandı. Detaylı anlam ve kullanım için kelimenin üzerine tıklayın.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search 500+ NCLEX terms, drugs, signs, rules..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-1 py-0.5 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sorting Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
            <ArrowUpDown className="w-3.5 h-3.5 text-sky-600" />
            <span>Sıralama (Sort):</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                setSortBy('importance');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                sortBy === 'importance'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🔥 Önem Sırası (#1 - #520)
            </button>
            <button
              onClick={() => {
                setSortBy('frequency');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                sortBy === 'frequency'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ⚡ Sıklık Düzeyi (Tier)
            </button>
            <button
              onClick={() => {
                setSortBy('alphabetical');
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                sortBy === 'alphabetical'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              A - Z
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
            <Filter className="w-3.5 h-3.5 text-sky-600" />
            <span>Kategori (Category):</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat === 'All' ? 'Tümü (All)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Frequency Tier Filter Pills */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Önem & Sıklık Katmanı (Tier):</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {tiers.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setSelectedTier(t);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTier === t
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t === 'All' ? 'Tüm Düzeyler' : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar (Count, Expand All / Collapse All) */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-medium">
        <span>
          Toplam <strong>{processedEntries.length}</strong> kavram bulundu (Sayfa {currentPage} / {totalPages})
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExpandAllOnPage}
            className="text-sky-700 hover:text-sky-800 font-bold hover:underline cursor-pointer"
          >
            Sayfayı Genişlet
          </button>
          <span>•</span>
          <button
            onClick={handleCollapseAll}
            className="text-slate-500 hover:text-slate-700 font-semibold hover:underline cursor-pointer"
          >
            Tümünü Daralt
          </button>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        {paginatedEntries.map((entry) => {
          const isExpanded = expandedIds.has(entry.id);

          return (
            <article
              key={entry.id}
              className={`bg-white rounded-2xl border transition-all duration-200 shadow-2xs ${
                isExpanded
                  ? 'border-sky-300 ring-2 ring-sky-100 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Clickable Header */}
              <div
                onClick={() => toggleExpand(entry.id)}
                className="p-4 cursor-pointer select-none flex items-start justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Rank Badge */}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-900 text-white">
                      #{entry.importanceRank ?? '?'}
                    </span>
                    {getTierBadge(entry.frequencyTier)}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                      {entry.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-sky-600 flex items-center gap-1.5">
                    {entry.title}
                  </h3>

                  {/* Brief Preview if collapsed */}
                  {!isExpanded && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {entry.meaning || entry.summary || entry.clinicalRule}
                    </p>
                  )}
                </div>

                {/* Expand / Collapse Indicator */}
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400 hover:text-sky-600 transition-colors">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-sky-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Expandable Details Container */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3.5 animate-fadeIn">
                  {/* 1. Anlam & Tanım (Meaning / Definition) */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                      Anlam & Patofizyolojik Tanım (Meaning & Definition)
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed bg-sky-50/40 p-3 rounded-xl border border-sky-100 font-normal">
                      {entry.meaning || entry.summary}
                    </p>
                  </div>

                  {/* 2. Detaylı Kullanım & Hemşirelik Girişimi (Detailed Clinical Usage) */}
                  {entry.detailedUsage && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                        Detaylı Klinik Kullanım & Hemşirelik Girişimi (Detailed Usage)
                      </span>
                      <p className="text-xs text-slate-800 leading-relaxed bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                        {entry.detailedUsage}
                      </p>
                    </div>
                  )}

                  {/* 3. Core Clinical Rule Box */}
                  {entry.clinicalRule && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                        Klinik Karar Kuralı (Core Decision Rule)
                      </span>
                      <div className="p-3 rounded-xl bg-slate-900 text-sky-100 text-xs leading-relaxed font-mono whitespace-pre-line">
                        {entry.clinicalRule}
                      </div>
                    </div>
                  )}

                  {/* 4. NCLEX Sınav Uyarısı & Tuzaklar (NCLEX Alert) */}
                  {entry.nclexAlert && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-rose-700">
                        <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        <span>NCLEX Sınav Uyarısı & Kritik Tuzak (High-Alert):</span>
                      </div>
                      <p className="text-rose-800 leading-relaxed">
                        {entry.nclexAlert}
                      </p>
                    </div>
                  )}

                  {/* 5. Vaka & Uygulama Örnekleri (Examples) */}
                  {entry.examples && entry.examples.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                        Klinik Vaka Örnekleri (Application Examples)
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {entry.examples.map((ex, i) => (
                          <li key={i} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <span className="text-sky-600 font-black">•</span>
                            <span>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 6. Altın Çıkarım (Key Takeaway) */}
                  {entry.keyTakeaway && (
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-800 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Altın Çıkarım: {entry.keyTakeaway}</span>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}

        {/* Empty State */}
        {paginatedEntries.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <p className="text-slate-600 text-sm font-medium">
              Aramanıza veya filtrenize uygun kavram bulunamadı.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedTier('All');
                setSortBy('importance');
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition-colors cursor-pointer shadow-2xs"
            >
              Filtreleri Temizle (Reset Filters)
            </button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs text-xs font-semibold text-slate-700">
          <button
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            ← Önceki (Prev)
          </button>

          <span className="text-slate-500">
            Sayfa <strong className="text-slate-900">{currentPage}</strong> / {totalPages}
          </span>

          <button
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Sonraki (Next) →
          </button>
        </div>
      )}
    </div>
  );
};
