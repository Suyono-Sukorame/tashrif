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
  const clean = past.replace(/[\u064B-\u065F\u0670]/g, "");
  if (clean.includes("ّ") || past.includes("ّ")) return "mudha'af";
  if (clean.charAt(1) === "ا") return "ajwaf";
  if (clean.endsWith("ى") || clean.endsWith("ا") || clean.endsWith("و") || clean.endsWith("ي")) return "naqis";
  if (clean.startsWith("و") || clean.startsWith("ي")) return "mithal";
  return "shahih";
}

/**
 * Extracts 3 root letters from a past tense verb
 */
function getRoots(past: string): [string, string, string] {
  const clean = past.replace(/[\u064B-\u065F\u0670]/g, "");
  return [clean.charAt(0), clean.charAt(1), clean.charAt(2)];
}

/**
 * Generates horizontal summary (Tashrif Ishtilahy)
 */
export function getIshtilahy(verb: any): IshtilahyResult[] {
  const cleanPast = (verb.past || "").replace(/[\u064B-\u065F\u0670]/g, "");
  const [f, a, l] = getRoots(verb.past || "");
  const bina = detectBina(verb.past || "");
  const isMazid = !!verb.isMazid || cleanPast.length > 3;

  // Prioritize DB values, then logic fallbacks
  const masdar = verb.masdar && verb.masdar !== '-' ? verb.masdar : (isMazid ? '-' : `${f}${a}ْ${l}ً`);
  const fail = verb.activeParticiple && verb.activeParticiple !== '-' ? verb.activeParticiple : (isMazid ? '-' : `${f}َاعِلٌ`);
  const maful = verb.passiveParticiple && verb.passiveParticiple !== '-' ? verb.passiveParticiple : (isMazid ? '-' : `مَ${f}ْ${a}ُ${l}ٌ`);
  
  // Isim Makan/Zaman Pattern
  const makan = verb.nounPlaceTime && verb.nounPlaceTime !== '-' ? verb.nounPlaceTime : 
               (isMazid ? '-' : (bina === 'mithal' ? `مَ${f}ْ${a}ِ${l}ٌ` : `مَ${f}ْ${a}َ${l}ٌ`));

  const amr = verb.past ? conjugate(verb.past, verb.present, 'imperative')[6].value : '-';

  return [
    { title: 'Madhi', value: verb.past, type: 'past' },
    { title: 'Mudhari', value: verb.present, type: 'present' },
    { title: 'Masdar', value: masdar, type: 'masdar' },
    { title: 'Fail', value: fail, type: 'activeParticiple' },
    { title: 'Maf\'ul', value: maful, type: 'passiveParticiple' },
    { title: 'Amr', value: amr, type: 'imperative' },
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
    let stem = '';
    let suffix = '';

    if (tense === 'past') {
      const suffixes = [
        'َ', 'َا', 'ُوا', 'َتْ', 'َتَا', 'ْنَ', 
        'ْتَ', 'ْتُمَا', 'ْتُمْ', 'ْتِ', 'ْتُمَا', 'ْتُنَّ', 
        'ْتُ', 'ْنَا'
      ];
      
      const [f, a, l] = getRoots(past);
      const weakLetter = past.endsWith("ا") ? "و" : "ي";
      const isAjwafWawi = present.includes('ُ');

      if (bina === "ajwaf" && index >= 5) {
        const v = isAjwafWawi ? 'ُ' : 'ِ';
        stem = f + v + l + 'ْ';
        suffix = suffixes[index].substring(1);
      } else if (bina === "mudha'af" && index >= 5) {
        const base = past.replace(/[\u064B-\u065F\u0670]/g, "");
        stem = base.charAt(0) + "َ" + base.charAt(1) + "َ" + base.charAt(1) + "ْ";
        suffix = suffixes[index].substring(1);
      } else if (bina === "naqis") {
        if (index === 0) {
          stem = past; suffix = '';
        } else if (index === 1) {
          stem = past.slice(0, -1) + weakLetter + "َ"; suffix = "ا";
        } else if (index === 2) {
          stem = past.slice(0, -1); suffix = "َوْا";
        } else if (index >= 5) {
          stem = past.slice(0, -1) + weakLetter + "ْ";
          suffix = suffixes[index].substring(1);
        } else {
          stem = past.slice(0, -1); suffix = suffixes[index];
        }
      } else if (index >= 5) {
        const cleanedPast = past.replace(/[\u064B-\u065F\u0670]$/, "");
        stem = cleanedPast + "ْ";
        suffix = suffixes[index].substring(1);
      } else {
        stem = past; suffix = '';
        if (index === 3) { stem = past.slice(0, -1); suffix = "َتْ"; }
        if (index === 4) { stem = past.slice(0, -1); suffix = "َتَا"; }
      }
      
      result = stem + suffix;
      parts.push({ text: stem, type: 'root' });
      if (suffix) parts.push({ text: suffix, type: 'suffix' });

    } else if (tense === 'present' || tense === 'present_manshub' || tense === 'present_majzum') {
      const prefixes = ['يَ', 'يَ', 'يَ', 'تَ', 'تَ', 'يَ', 'تَ', 'تَ', 'تَ', 'تَ', 'تَ', 'تَ', 'أَ', 'نَ'];
      let suffixes = ['ُ', 'انِ', 'ونَ', 'ُ', 'انِ', 'نَ', 'ُ', 'انِ', 'ونَ', 'ينَ', 'انِ', 'نَ', 'ُ', 'ُ'];
      
      if (tense === 'present_manshub') {
        suffixes = ['َ', 'ا', 'وا', 'َ', 'ا', 'نَ', 'َ', 'ا', 'وا', 'ي', 'ا', 'نَ', 'َ', 'َ'];
      } else if (tense === 'present_majzum') {
        suffixes = ['ْ', 'ا', 'وا', 'ْ', 'ا', 'نَ', 'ْ', 'ا', 'وا', 'ي', 'ا', 'nَ', 'ْ', 'ْ'];
      }

      const isMazidPresent = present.startsWith('يُ') || present.startsWith('تُ') || present.startsWith('أُ') || present.startsWith('نُ');
      const actualPrefix = prefixes[index].replace('َ', isMazidPresent ? 'ُ' : 'َ');
      
      let stemText = present.replace(/^[\u0621-\u064A][\u064B-\u065F\u0670]?/, "").replace(/[\u064B-\u065F\u0670]$/, "");
      let currentSuffix = suffixes[index];
      
      if (bina === "naqis") {
        if (tense === "present_majzum" && [0, 3, 6, 12, 13].includes(index)) {
          stemText = stemText.replace(/[وىاى]$/, ""); currentSuffix = '';
        } else if (tense === "present_manshub" && [0, 3, 6, 12, 13].includes(index)) {
          if (stemText.endsWith("و") || stemText.endsWith("ي")) {
             currentSuffix = 'َ';
          } else {
             currentSuffix = '';
          }
        }
      }

      if (bina === "ajwaf" && tense === "present_majzum" && [0, 3, 6, 12, 13].includes(index)) {
         stemText = stemText.replace(/[وي]/, "");
      }

      result = actualPrefix + stemText + currentSuffix;
      parts.push({ text: actualPrefix, type: 'prefix' });
      parts.push({ text: stemText, type: 'root' });
      if (currentSuffix) parts.push({ text: currentSuffix, type: 'suffix' });

    } else if (tense === 'future') {
       const p = conjugate(past, present, 'present')[index];
       result = 'سَـ' + p.value;
       parts.push({ text: 'سَـ', type: 'prefix' });
       parts.push(...p.parts);

    } else if (tense === 'imperative') {
       if (index >= 6 && index <= 11) {
          const p = conjugate(past, present, 'present_majzum')[index];
          result = p.value.replace(/^[\u0621-\u064A][\u064B-\u065F\u0670]?/, "");
          
          const hasHarakat = result.length > 1 && /[\u064B-\u064E\u0650]/.test(result.charAt(1));
          if (!hasHarakat && !present.startsWith('يُ')) {
             result = (result.includes('ُ') ? 'اُ' : 'اِ') + result;
          }
          parts.push({ text: result, type: 'root' });
       } else {
          result = '-'; parts.push({ text: '-', type: 'root' });
       }
    }

    // FINAL SANITIZATION: Remove identical double harakats
    result = result.replace(/([\u064B-\u0652])\1+/g, "$1");

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
