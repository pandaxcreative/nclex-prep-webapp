import { NCLEXQuestion } from '../types';

export interface AIStatusResponse {
  provider: string;
  model: string;
  isLiveConfigured: boolean;
  features: string[];
}

export interface AITutorResponse {
  success: boolean;
  source: string;
  model?: string;
  explanation: string;
}

export interface AIGenerateQuestionResponse {
  success: boolean;
  source: string;
  question: NCLEXQuestion;
  note?: string;
}

export const aiService = {
  async getStatus(): Promise<AIStatusResponse> {
    try {
      const res = await fetch('/api/ai/status');
      if (!res.ok) {
        throw new Error('Failed to fetch AI status');
      }
      return await res.json();
    } catch {
      return {
        provider: 'Groq (Llama 3.3)',
        model: 'llama-3.3-70b-versatile',
        isLiveConfigured: false,
        features: ['NCLEX-RN Next-Gen Question Generator', 'Clinical Judgment Tutor']
      };
    }
  },

  async generateQuestion(
    category: string = 'Prioritization',
    topic: string = 'High-Yield Clinical Practice'
  ): Promise<AIGenerateQuestionResponse> {
    const res = await fetch('/api/ai/generate-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, topic })
    });

    if (!res.ok) {
      throw new Error(`AI generation failed with status ${res.status}`);
    }

    return await res.json();
  },

  async askNurseTutor(params: {
    question: string;
    options?: Array<{ text: string; isCorrect?: boolean }>;
    userChoice?: string;
    topic?: string;
    specificQuery?: string;
  }): Promise<AITutorResponse> {
    const res = await fetch('/api/ai/ask-tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      throw new Error(`Nurse Tutor request failed with status ${res.status}`);
    }

    return await res.json();
  }
};
