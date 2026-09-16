import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Zap,
  HelpCircle,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { NCLEXQuestion } from '../types';
import { aiService, AITutorResponse, AIStatusResponse } from '../services/aiService';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: NCLEXQuestion | null;
  selectedOptionIndex: number | null;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  question,
  selectedOptionIndex
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [aiStatus, setAiStatus] = useState<AIStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      aiService.getStatus().then(setAiStatus).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && question) {
      fetchClinicalExplanation();
    } else {
      setExplanation('');
      setError(null);
      setCustomPrompt('');
    }
  }, [isOpen, question]);

  const fetchClinicalExplanation = async (specificQuery?: string) => {
    if (!question) return;
    setLoading(true);
    setError(null);

    const userSelectedText =
      selectedOptionIndex !== null && selectedOptionIndex !== undefined
        ? question.options[selectedOptionIndex]?.text
        : undefined;

    try {
      const res: AITutorResponse = await aiService.askNurseTutor({
        question: question.question,
        options: question.options,
        userChoice: userSelectedText,
        topic: question.category,
        specificQuery
      });

      if (res.explanation) {
        setExplanation(res.explanation);
      } else {
        setExplanation('No clinical analysis returned. Please try again.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reach AI Tutor';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !question) return null;

  const quickQuestions = [
    'Explain the ABC prioritization hierarchy',
    'Why is the most common distractor incorrect?',
    'Give me a mnemonic to remember this'
  ];

  const handleQuickQuestion = (q: string) => {
    setCustomPrompt(q);
    fetchClinicalExplanation(q);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    fetchClinicalExplanation(customPrompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-xl max-h-[90vh] rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-sky-700 via-sky-800 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm sm:text-base">Nurse Mentor AI Tutor</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                  <Zap className="w-3 h-3 fill-amber-300" />
                  Groq Speed
                </span>
              </div>
              <p className="text-[11px] text-sky-200">
                {aiStatus?.provider ? `${aiStatus.provider} (${aiStatus.model})` : 'AI Clinical Analysis'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-sm">
          {/* Question Recap Pill */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-500 font-semibold">
              <span className="flex items-center gap-1 text-sky-700 font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                {question.category}
              </span>
              {question.frameworkTag && (
                <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                  {question.frameworkTag}
                </span>
              )}
            </div>
            <p className="text-slate-800 font-medium line-clamp-2">{question.question}</p>
          </div>

          {/* Quick Action Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Quick Clinical Inquiries:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  disabled={loading}
                  className="px-2.5 py-1 text-xs rounded-lg bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition-colors font-medium cursor-pointer disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="py-8 text-center space-y-2">
              <Loader2 className="w-7 h-7 text-sky-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700">
                Synthesizing Clinical Judgment via Groq LPU...
              </p>
              <p className="text-[11px] text-slate-400">
                Applying ABC priority hierarchy, ADPIE sequencing, and distractor traps.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Could not fetch AI response:</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* AI Explanation Body */}
          {!loading && explanation && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                {explanation}
              </div>

              {/* Status footer tip */}
              {!aiStatus?.isLiveConfigured && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    <strong>Free Groq Key:</strong> To activate custom live generation for any prompt, set <code>GROQ_API_KEY</code> in environment variables.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Input for Custom Questions */}
        <form
          onSubmit={handleCustomSubmit}
          className="p-3 sm:p-4 border-t border-slate-200 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Ask Nurse Mentor a specific question about this case..."
            disabled={loading}
            className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={loading || !customPrompt.trim()}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
