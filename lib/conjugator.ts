/**
 * Advanced Arabic Verb Conjugation Engine v2.0
 * Handles Shahih, Ajwaf, Naqish, and Mudha'af with I'lal rules.
 */

export type Tense = 'past' | 'present' | 'present_manshub' | 'present_majzum' | 'imperative' | 'future' | 'ishtilahy';

export type BinaType = "shahih" | "ajwaf" | "naqis" | "mudha'af" | "mithal";

export interface IshtilahyResult {
  title: string;
  value: string;
  type: string;
}

export interface ConjugationPart {
  text: string;
  type: 'prefix' | 'root' | 'suffix';
}

export interface ConjugationResult {
  dhamir: string;
  pronoun: string;
  value: string;
  translation: string;
  parts: ConjugationPart[];
}

export const DHAMIRS = [
  { ar: 'هُوَ', en: 'Dia (Laki-laki)', pronouns: ['huwa'] },
  { ar: 'هُمَا', en: 'Mereka Berdua (L)', pronouns: ['huma', 'm'] },
  { ar: 'هُمْ', en: 'Mereka (L)', pronouns: ['hum'] },
  { ar: 'هِيَ', en: 'Dia (Perempuan)', pronouns: ['hiya'] },
  { ar: 'هُمَا (م)', en: 'Mereka Berdua (P)', pronouns: ['huma', 'f'] },
  { ar: 'هُنَّ', en: 'Mereka (P)', pronouns: ['hunna'] },
  { ar: 'أَنْتَ', en: 'Kamu (L)', pronouns: ['anta'] },
  { ar: 'أَنْتُمَا', en: 'Kalian Berdua (L)', pronouns: ['antuma', 'm'] },
  { ar: 'أَنْتُمْ', en: 'Kalian (L)', pronouns: ['antum'] },
  { ar: 'أَنْتِ', en: 'Kamu (P)', pronouns: ['anti'] },
  { ar: 'أَنْتُمَا (م)', en: 'Kalian Berdua (P)', pronouns: ['antuma', 'f'] },
  { ar: 'أَنْتُنَّ', en: 'Kalian (P)', pronouns: ['antunna'] },
  { ar: 'أَنَا', en: 'Saya', pronouns: ['ana'] },
  { ar: 'نَحْنُ', en: 'Kami', pronouns: ['nahnu'] },
];

/**
 * Detects the Bina' type of a verb
 */
function detectBina(past: string, root?: string): BinaType {
  // Simple heuristic for detection
  if (past.includes("ّ")) return "mudha'af";
  if (past.charAt(1) === "ا") return "ajwaf";
  if (past.endsWith("ى") || past.endsWith("ا")) return "naqis";
  if (past.startsWith("و") || past.startsWith("ي")) return "mithal";
  return "shahih";
}

/**
 * Extracts 3 root letters from a past tense verb
 */
function getRoots(past: string): [string, string, string] {
  const clean = past.replace(/[َُِّْ]/g, "");
  return [clean.charAt(0), clean.charAt(1), clean.charAt(2)];
}

/**
 * Generates horizontal summary (Tashrif Ishtilahy)
 */
export function getIshtilahy(verb: any): IshtilahyResult[] {
  const [f, a, l] = getRoots(verb.past || "");
  const bina = detectBina(verb.past || "");

  const masdar = verb.masdar && verb.masdar !== '-' ? verb.masdar : `${f}${a}ْ${l}ً`;
  const fail = verb.activeParticiple && verb.activeParticiple !== '-' ? verb.activeParticiple : `${f}َاعِلٌ`;
  const maful = verb.passiveParticiple && verb.passiveParticiple !== '-' ? verb.passiveParticiple : `مَ${f}ْ${a}ُ${l}ٌ`;
  
  // Isim Makan/Zaman Pattern: Maf'ilun for Mithal, Maf'alun for others
  const makan = verb.nounPlaceTime && verb.nounPlaceTime !== '-' ? verb.nounPlaceTime : 
               (bina === 'mithal' ? `مَ${f}ْ${a}ِ${l}ٌ` : `مَ${f}ْ${a}َ${l}ٌ`);

  return [
    { title: 'Madhi', value: verb.past, type: 'past' },
    { title: 'Mudhari', value: verb.present, type: 'present' },
    { title: 'Masdar', value: masdar, type: 'masdar' },
    { title: 'Fail', value: fail, type: 'activeParticiple' },
    { title: 'Maf\'ul', value: maful, type: 'passiveParticiple' },
    { title: 'Amr', value: verb.past ? conjugate(verb.past, verb.present, 'imperative')[6].value : '-', type: 'imperative' },
    { title: 'Makan/Zaman', value: makan, type: 'nounPlaceTime' },
  ];
}

/**
 * Core conjugation engine
 */
export function conjugate(past: string, present: string, tense: Tense): ConjugationResult[] {
  const results: ConjugationResult[] = [];
  const bina = detectBina(past);

  DHAMIRS.forEach((d, index) => {
    let result = '';
    const parts: ConjugationPart[] = [];
    
    if (tense === 'past') {
      const suffixes = [
        'َ', 'َا', 'ُوا', 'َتْ', 'َتَا', 'ْنَ', 
        'ْتَ', 'ْتُمَا', 'ْتُمْ', 'ْتِ', 'ْتُمَا', 'ْتُنَّ', 
        'ْتُ', 'ْنَا'
      ];
      
      let stem = past.slice(0, -1);
      let suffix = suffixes[index];

      // I'LAL RULES FOR PAST
      if (bina === "ajwaf" && index >= 5) {
        stem = past.charAt(0) + "ُ"; 
      } else if (bina === "mudha'af" && index >= 5) {
        const base = past.replace("ّ", "");
        stem = base.charAt(0) + "َ" + base.charAt(1) + "َ" + base.charAt(1);
      } else if (bina === "naqis") {
        // Determine the hidden root (Waw or Ya)
        // Usually, if ends with 'ا' it's Wawi, if 'ى' it's Ya'i
        const weakLetter = past.endsWith("ا") ? "و" : "ي";
        
        if (index === 1) { // Huma (L)
          stem = past.slice(0, -1) + weakLetter + "َ";
          suffix = "ا";
        } else if (index === 2) { // Hum
          stem = past.slice(0, -1);
          suffix = "َوْا";
        } else if (index >= 5) { // Anta, Ana, etc.
          stem = past.slice(0, -1) + weakLetter + "َ";
          suffix = suffixes[index].replace("ْت", "ْط"); // Temporary placeholder to avoid confusion
          // Actually simpler:
          stem = past.slice(0, -1) + weakLetter + "ْ";
          suffix = suffixes[index].substring(1);
        }
      } else if (index >= 5) {
        stem = stem + "ْ";
      }
      
      result = stem + suffix;
      parts.push({ text: stem, type: 'root' });
      if (suffix) parts.push({ text: suffix, type: 'suffix' });

    } else if (tense === 'present' || tense === 'present_manshub' || tense === 'present_majzum') {
      const prefixes = ['يَ', 'يَ', 'يَ', 'تَ', 'تَ', 'يَ', 'تَ', 'تَ', 'تَ', 'تَ', 'تَ', 'تَ', 'أَ', 'نَ'];
      let suffixes = ['ُ', 'انِ', 'ونَ', 'ُ', 'انِ', 'نَ', 'ُ', 'انِ', 'ونَ', 'ينَ', 'انِ', 'نَ', 'ُ', 'ُ'];
      
      // MANSHUB & MAJZUM MODIFIERS
      if (tense === 'present_manshub') {
        suffixes = ['َ', 'ا', 'وا', 'َ', 'ا', 'نَ', 'َ', 'ا', 'وا', 'ي', 'ا', 'نَ', 'َ', 'َ'];
      } else if (tense === 'present_majzum') {
        suffixes = ['ْ', 'ا', 'وا', 'ْ', 'ا', 'نَ', 'ْ', 'ا', 'وا', 'ي', 'ا', 'نَ', 'ْ', 'ْ'];
      }

      const prefixText = prefixes[index];
      let stemText = present.substring(1, present.length - 1);
      
      // Clean prefix vowel if SDK added it
      if (stemText.startsWith('َ') || stemText.startsWith('ُ') || stemText.startsWith('ِ')) {
        stemText = stemText.substring(1);
      }
      
      let currentSuffix = suffixes[index];
      
      // I'LAL RULES FOR NAQIS (Weak Ending)
      if (bina === "naqis") {
        if (tense === "present_majzum" && [0, 3, 6, 12, 13].includes(index)) {
          // Remove final weak letter but keep harakat
          stemText = stemText.replace(/[وىاى]$/, ""); 
          currentSuffix = ''; // Suffix is removed
        } else if (tense === "present_manshub" && [0, 3, 6, 12, 13].includes(index)) {
          if (stemText.endsWith("و") || stemText.endsWith("ي")) {
             currentSuffix = 'َ'; // Fathah visible
          } else {
             currentSuffix = ''; // Muqaddarah for Alif Maqshurah
          }
        }
      }

      result = prefixText + stemText + currentSuffix;
      parts.push({ text: prefixText, type: 'prefix' });
      parts.push({ text: stemText, type: 'root' });
      if (currentSuffix) parts.push({ text: currentSuffix, type: 'suffix' });

    } else if (tense === 'future') {
       const presentForms = conjugate(past, present, 'present');
       const p = presentForms[index];
       result = 'سَـ' + p.value;
       parts.push({ text: 'سَـ', type: 'prefix' });
       parts.push(...p.parts);

    } else if (tense === 'imperative') {
       if (index >= 6 && index <= 11) {
          const presentMajzum = conjugate(past, present, 'present_majzum');
          const p = presentMajzum[index];
          // Remove prefix (يَ/تَ/أَ/نَ) to get the stem
          result = p.value.substring(2);
          
          // Detect if the first letter of the stem has a harakat
          // If it doesn't have fatha/damma/kasrah at index 1, it's sakin and needs Alif
          const hasHarakat = result.length > 1 && ['َ', 'ُ', 'ِ'].includes(result.charAt(1));
          
          if (!hasHarakat) {
             // Add Alif with proper harakat (simplified to Kasrah/Dammah)
             const alifHarakat = result.includes('ُ') ? 'اُ' : 'اِ';
             result = alifHarakat + result;
          }

          parts.push({ text: result, type: 'root' });
       } else {
          result = '-';
          parts.push({ text: '-', type: 'root' });
       }
    }

    results.push({
      dhamir: d.ar,
      pronoun: d.en,
      value: result,
      translation: '',
      parts: parts
    });
  });

  return results;
}
