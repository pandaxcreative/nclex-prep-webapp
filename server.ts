import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to determine active AI provider
function getAIProvider() {
  if (process.env.GROQ_API_KEY) {
    return {
      name: 'Groq',
      model: 'llama-3.3-70b-versatile',
      configured: true
    };
  }
  if (process.env.OPENROUTER_API_KEY) {
    return {
      name: 'OpenRouter',
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      configured: true
    };
  }
  if (process.env.GEMINI_API_KEY) {
    return {
      name: 'Gemini',
      model: 'gemini-2.5-flash',
      configured: true
    };
  }
  return {
    name: 'Groq (Demo Mode)',
    model: 'llama-3.3-70b-versatile',
    configured: false
  };
}

// 1. Health & AI Status endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/ai/status', (req, res) => {
  const provider = getAIProvider();
  res.json({
    provider: provider.name,
    model: provider.model,
    isLiveConfigured: provider.configured,
    features: [
      'NCLEX-RN Next-Gen Question Generator',
      'Clinical Judgment Tutor (ABC & ADPIE Analysis)',
      'Distractor Elimination & Rationale Breakdown'
    ]
  });
});

// Call Groq / OpenRouter API
async function callChatCompletion(messages: Array<{ role: string; content: string }>, jsonMode = false) {
  const groqKey = process.env.GROQ_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (groqKey) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.5,
        max_tokens: 1500,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  if (openRouterKey) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://nclex-micro-prep.app',
        'X-Title': 'NCLEX Micro-Prep'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages,
        temperature: 0.5,
        max_tokens: 1500,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  return null;
}

// 2. Generate Next-Gen NCLEX Question
app.post('/api/ai/generate-question', async (req, res) => {
  try {
    const { category = 'Prioritization', topic = 'High-Yield Clinical Practice' } = req.body;
    const provider = getAIProvider();

    if (provider.configured) {
      const prompt = `You are an elite NCLEX-RN exam writer and nurse educator.
Create ONE challenging Next-Generation NCLEX (NGN) style multiple choice question on the category: "${category}" and topic: "${topic}".
Adhere strictly to standard NCLEX principles:
- Focus on ABC (Airway, Breathing, Circulation), ADPIE (Assessment First), Acute vs Chronic, or Unexpected vs Expected.
- Exactly 4 options, where exactly ONE option is correct ("isCorrect": true) and three options are plausible distractors ("isCorrect": false).
- Provide a detailed clinical rationale explaining why the correct choice saves the patient and why the distractors are wrong.
- Provide a high-yield hint invoking a clinical judgment framework.

Return strictly valid JSON with this exact schema:
{
  "id": ${Date.now()},
  "category": "${category}",
  "question": "Clear clinical scenario with patient findings",
  "options": [
    { "text": "Option A text", "isCorrect": false },
    { "text": "Option B text", "isCorrect": true },
    { "text": "Option C text", "isCorrect": false },
    { "text": "Option D text", "isCorrect": false }
  ],
  "rationale": "Comprehensive clinical explanation and mechanism",
  "hint": "Specific clinical judgment framework tip (e.g., ABC rule or Assessment first)",
  "frameworkTag": "ABC Rule / Prioritization"
}`;

      const raw = await callChatCompletion(
        [
          {
            role: 'system',
            content: 'You are an expert NCLEX-RN exam item writer. You output only valid JSON.'
          },
          { role: 'user', content: prompt }
        ],
        true
      );

      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          return res.json({
            success: true,
            source: provider.name,
            question: parsed
          });
        } catch (parseErr) {
          console.error('Failed to parse AI response JSON:', parseErr, raw);
        }
      }
    }

    // Fallback: Dynamic high-yield clinical generator if API key not set
    const fallbackQuestions = [
      {
        id: Date.now(),
        category: category || 'Prioritization',
        question: 'A nurse on an acute telemetry floor receives morning report. Which client must the nurse assess FIRST?',
        options: [
          { text: 'A client with heart failure who has 2+ pitting bilateral ankle edema and clear breath sounds.', isCorrect: false },
          { text: 'A client with a newly inserted central venous line who suddenly develops dyspnea, cyanosis, and tachycardia.', isCorrect: true },
          { text: 'A client with hypertension with BP 154/92 mmHg requesting their morning dose of amlodipine.', isCorrect: false },
          { text: 'A client 2 days post-cholecystectomy who reports incision pain rated 6/10.', isCorrect: false }
        ],
        rationale: 'Sudden dyspnea, cyanosis, and tachycardia after central venous catheter manipulation indicates an acute Air Embolism, an immediate circulatory and respiratory emergency. The nurse must clamp the line, position the client in Trendelenburg on the left side (to trap air in the right atrium), and apply 100% oxygen.',
        hint: 'Apply the ABC hierarchy: Which patient has sudden acute respiratory distress and shock signs indicating an immediate life threat?',
        frameworkTag: 'Airway & Circulation'
      },
      {
        id: Date.now() + 1,
        category: category || 'Pharmacology',
        question: 'A nurse is preparing to administer IV vancomycin 1g in 250 mL D5W over 60 minutes. Ten minutes into the infusion, the client develops profound erythema and flushing of the face, neck, and upper torso with pruritus, but stable vital signs. What is the nurse\'s priority action?',
        options: [
          { text: 'Stop the infusion immediately and administer IM epinephrine for anaphylaxis.', isCorrect: false },
          { text: 'Slow or stop the infusion, assess for airway compromise, and inform the provider to extend the infusion duration to at least 120 minutes.', isCorrect: true },
          { text: 'Increase the IV rate to complete the medication faster before symptoms worsen.', isCorrect: false },
          { text: 'Document the finding as an expected harmless response to antibiotic therapy.', isCorrect: false }
        ],
        rationale: 'Flushing and erythema of the face, neck, and upper chest during rapid vancomycin administration is Vancomycin Flushing Syndrome (historically known as Red Man Syndrome), caused by non-IgE mediated direct histamine release from mast cells when infused too rapidly (<60 mins). Slowing the infusion rate (to at least 100-120 mins) and pretreating with antihistamines manages the reaction. Anaphylaxis features stridor, bronchospasm, and shock.',
        hint: 'Distinguish between an infusion rate-related histamine reaction (infuse slower over >= 2 hours) versus true IgE-mediated anaphylaxis with airway compromise.',
        frameworkTag: 'Safe Administration'
      }
    ];

    const chosen = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
    return res.json({
      success: true,
      source: `${provider.name} (Curated NGN Bank)`,
      question: chosen,
      note: 'To activate live real-time LLM question generation, configure GROQ_API_KEY in environment secrets.'
    });
  } catch (err: unknown) {
    console.error('Error generating question:', err);
    const message = err instanceof Error ? err.message : 'Unknown server error';
    res.status(500).json({ error: message });
  }
});

// 3. Ask Nurse Tutor (Clinical Reasoning Explainer)
app.post('/api/ai/ask-tutor', async (req, res) => {
  try {
    const { question, options, userChoice, topic, specificQuery } = req.body;
    const provider = getAIProvider();

    if (provider.configured) {
      const optionsContext = options && Array.isArray(options)
        ? options.map((opt: { text: string; isCorrect?: boolean }, i: number) => `Option ${String.fromCharCode(65 + i)}: ${opt.text} ${opt.isCorrect ? '(CORRECT ANSWER)' : ''}`).join('\n')
        : '';

      const systemPrompt = `You are "Nurse Mentor AI", a warm, encouraging, and razor-sharp NCLEX-RN exam coach with 15+ years of clinical teaching experience.
Your goal is to explain clinical reasoning with crystal-clear NCLEX judgment rules:
1. Identify the core priority framework (e.g. ABC, ADPIE, Acute vs Chronic, Maslow).
2. Explain WHY the correct answer is the highest clinical priority (how it prevents deterioration or death).
3. Explain WHY each incorrect option is a distractor (why it can wait, or why it is an assessment trap).
4. Give one golden "NCLEX Memory Pearl" or mnemonic to never miss this concept again.
Keep the tone supportive, direct, and structured with clean bullet points.`;

      const userPrompt = `Clinical Scenario:
"${question}"

Options:
${optionsContext}

Student's Choice / Question:
"${userChoice ? `The student selected: "${userChoice}"` : specificQuery || 'Please explain the clinical judgment rationale in depth.'}"

Please provide your expert clinical breakdown.`;

      const answer = await callChatCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]);

      if (answer) {
        return res.json({
          success: true,
          source: provider.name,
          model: provider.model,
          explanation: answer
        });
      }
    }

    // Dynamic offline clinical guidance if API key is absent
    const offlineExplanation = `### 🩺 Nurse Mentor Clinical Breakdown

**1. Priority Framework Applied: ABCs & Acute vs. Chronic**
In Next-Gen NCLEX scenarios, clients exhibiting sudden changes in respiratory or circulatory status take automatic precedence over clients experiencing predictable chronic disease presentations or post-operative pain.

**2. Clinical Judgment Key:**
- **Airway/Breathing First:** Any loss of airway patency, silent chest, stridor, or sudden dyspnea represents immediate hypoxia risk.
- **Unexpected vs. Expected:** Pain of 8/10 in a post-op client is expected and requires analgesia, but it does NOT threaten life before acute respiratory compromise.

**3. Distractor Elimination Strategy:**
- **Option Traps:** Notice options describing stable chronic conditions (e.g., baseline low hemoglobin in CKD, mild fever in pneumonia). These are classic NCLEX distractor traps designed to test whether you can recognize expected pathology versus acute decompensation.

💡 **Golden NCLEX Pearl:** *"Never treat a chronic symptom while an acute airway or circulation crisis is brewing in the next room."*

*(Tip: To enable custom live interactive AI coaching powered by Groq Llama 3.3, add GROQ_API_KEY in the environment secrets.)*`;

    return res.json({
      success: true,
      source: `${provider.name} (Curated Guidance)`,
      explanation: offlineExplanation
    });
  } catch (err: unknown) {
    console.error('Error in ask-tutor:', err);
    const message = err instanceof Error ? err.message : 'Unknown server error';
    res.status(500).json({ error: message });
  }
});

// Vite middleware setup
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NCLEX Micro-Prep Server running at http://0.0.0.0:${PORT}`);
  });
}

start();
