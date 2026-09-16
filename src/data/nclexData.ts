import rawData from './data.json';
import { NCLEXQuestion, Flashcard, CheatSheetEntry } from '../types';

export const nclexQuestions: NCLEXQuestion[] = rawData.questions as NCLEXQuestion[];
export const flashcardsData: Flashcard[] = rawData.flashcards as Flashcard[];

export const cheatSheetEntries: CheatSheetEntry[] = [
  {
    id: 'acute-chronic',
    title: 'Acute vs. Chronic',
    category: 'Priority Rules',
    summary: 'Acute conditions and recent changes always take priority over chronic, longstanding medical conditions.',
    clinicalRule: 'New-onset symptoms or sudden alterations beat established chronic illness every time on the NCLEX.',
    examples: [
      'Prioritize a patient admitted 2 hours ago with acute appendicitis over a patient with chronic COPD on 2L oxygen.',
      'A sudden drop in blood pressure takes priority over a patient who has lived with osteoarthritis for 10 years.'
    ],
    keyTakeaway: 'Always choose the new, acute, or changing condition over the stable or chronic condition.'
  },
  {
    id: 'unstable-stable',
    title: 'Unstable vs. Stable',
    category: 'Priority Rules',
    summary: 'Unstable clients are in jeopardy of rapid physiological deterioration; stable clients have predictable responses.',
    clinicalRule: 'Look for qualifying unstable keywords: "Sudden", "New onset", "Changing", "Worsening", "Unexpected", "Acute". Stable keywords: "Ready for discharge", "Chronic", "Consistent", "Baseline", "Post-op >12h without fever".',
    examples: [
      'Unstable: A diabetic whose blood sugar dropped to 48 mg/dL with diaphoresis (acute hypoglycemia).',
      'Stable: A diabetic with fasting glucose of 180 mg/dL with no acute distress.'
    ],
    keyTakeaway: 'The client with unstable hemodynamics or airway compromise must be evaluated first.'
  },
  {
    id: 'unexpected-expected',
    title: 'Unexpected vs. Expected',
    category: 'Priority Rules',
    summary: 'An expected sign or symptom of a disease does not warrant priority over an unexpected or dangerous anomaly.',
    clinicalRule: 'Ask yourself: "Is this finding part of the standard textbook progression of this disease, or does it signal a life-threatening complication?"',
    examples: [
      'Expected: Pain and swelling following knee arthroplasty (standard post-op finding).',
      'Unexpected & Priority: Sudden unilateral calf pain, warmth, or shortness of breath (DVT / PE warning).'
    ],
    keyTakeaway: 'Complications (unexpected) always take precedence over natural disease manifestations (expected).'
  },
  {
    id: 'abc-priority',
    title: 'ABC Framework (Airway, Breathing, Circulation)',
    category: 'Priority Rules',
    summary: 'The universal emergency hierarchy: Airway always comes before Breathing, and Breathing comes before Circulation.',
    clinicalRule: 'Airway: Stridor, silent chest in asthma, choking, facial burns, angioedema. Breathing: Tachypnea, SpO2 < 90%, asymmetric chest expansion. Circulation: Shock, hemorrhage, absent pulses, severe arrhythmia.',
    examples: [
      'Stridor or wheezing cessation (silent chest) takes priority over severe hemorrhage or tachycardia.',
      'Exception: In active cardiac arrest, follow AHA guidelines (CAB: Compressions first).'
    ],
    keyTakeaway: 'Airway > Breathing > Circulation > Disability > Exposure.'
  },
  {
    id: 'adpie-assess-first',
    title: 'ADPIE: Assess First Before Intervening',
    category: 'Priority Rules',
    summary: 'Unless the client is in immediate cardiac arrest or lethal distress, the nurse must always gather data before taking action.',
    clinicalRule: 'Assessment (A) precedes Diagnosis (D), Planning (P), Implementation (I), and Evaluation (E). If you do not have adequate assessment data in the stem, choose the assessment option.',
    examples: [
      'If a client complains of dyspnea, check pulse oximetry and auscultate lungs BEFORE calling the provider or administering medications.',
      'Exception: When the question stem already states the nurse has completed the full assessment, move directly to implementation.'
    ],
    keyTakeaway: 'Never pick an intervention if you haven\'t validated the patient baseline through assessment.'
  },
  {
    id: 'delegation-eat',
    title: 'Delegation: Do NOT Delegate what you can E-A-T',
    category: 'Priority Rules',
    summary: 'The Registered Nurse retains legal accountability for the nursing process and clinical judgment.',
    clinicalRule: 'Never delegate to LPN or UAP: Evaluation (E), Assessment (A), or Teaching (T).',
    examples: [
      'RN: Initial assessment, admission, discharge teaching, unstable patients, IV push medications, blood administration.',
      'LPN/LVN: Stable patients, dressing changes, routine Foley catheter insertion, oral/subQ medications, enteral tube feedings.',
      'UAP: Vitals on stable clients, ambulation, hygiene, intake & output, repositioning.'
    ],
    keyTakeaway: 'If it requires clinical judgment, patient teaching, or initial assessment, it stays with the RN.'
  },
  {
    id: 'mnemonic-veal-chop',
    title: 'VEAL CHOP (Fetal Heart Rate Monitoring)',
    category: 'Essential Mnemonics',
    summary: 'Decodes fetal decelerations during labor and determines emergency response.',
    clinicalRule: 'V = Variable decels -> C = Cord compression (Reposition mom, O2, IV fluids)\nE = Early decels -> H = Head compression (Normal, prepare for delivery)\nA = Accelerations -> O = OK / Oxygenated (Reassuring!)\nL = Late decels -> P = Placental insufficiency (Emergency: Stop Pitocin, L-lateral, O2, fluids)',
    examples: [
      'Late decelerations indicate uterine-placental insufficiency; must immediately turn off oxytocin and position on left side.',
      'Early decelerations mirror contractions and indicate normal head descent.'
    ],
    keyTakeaway: 'Late and Variable decels require immediate intervention; Early is physiological.'
  },
  {
    id: 'mnemonic-mona',
    title: 'MONA (Myocardial Infarction Acute Care)',
    category: 'Essential Mnemonics',
    summary: 'Standard initial pharmacologic protocol for Acute Coronary Syndrome.',
    clinicalRule: 'M = Morphine (reduces preload & anxiety)\nO = Oxygen (if SpO2 < 90%)\nN = Nitroglycerin (sublingual vasodilator; check BP & no phosphodiesterase inhibitors)\nA = Aspirin (chewable 162-325 mg antiplatelet)',
    examples: [
      'In real clinical sequence: O-A-N-M is often given (Aspirin + Oxygen first, then Nitro, then Morphine if pain persists).',
      'Never give Nitroglycerin if systolic BP < 90 mmHg or if the patient took sildenafil within 24-48h.'
    ],
    keyTakeaway: 'Check blood pressure and ED medication history before administering Nitroglycerin.'
  },
  {
    id: 'mnemonic-rome',
    title: 'ROME (Arterial Blood Gas Interpretation)',
    category: 'Essential Mnemonics',
    summary: 'Quickly differentiate Respiratory vs. Metabolic Acidosis and Alkalosis.',
    clinicalRule: 'R-O: Respiratory Opposite (pH and PaCO2 move in opposite directions).\nM-E: Metabolic Equal (pH and HCO3 move in the same direction).\nNormal ranges: pH 7.35-7.45, PaCO2 35-45 mmHg, HCO3 22-26 mEq/L.',
    examples: [
      'pH 7.28 (Low) + PaCO2 52 (High) = Respiratory Acidosis (Opposite).',
      'pH 7.50 (High) + HCO3 32 (High) = Metabolic Alkalosis (Equal).'
    ],
    keyTakeaway: 'If pH is abnormal, look at PaCO2 and HCO3 to identify primary acid-base disorder.'
  }
];

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
