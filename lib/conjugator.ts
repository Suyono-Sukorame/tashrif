/**
 * Advanced Arabic Verb Conjugation Engine
 * This is a simplified but robust version for the enterprise app.
 * In a real-world scenario, this would handle complex morphophonological rules.
 */

export type Tense = 'past' | 'present' | 'present_manshub' | 'present_majzum' | 'imperative' | 'future';

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
 * Simplified rule-based engine for common patterns
 * Handles Shahih, and some Mithal (like waqa'a)
 */
export function conjugate(past: string, present: string, tense: Tense): ConjugationResult[] {
  const results: ConjugationResult[] = [];

  const basePast = past; // e.g. وَقَعَ
  const basePresent = present; // e.g. يَقَعُ
  
  DHAMIRS.forEach((d, index) => {
    let result = '';
    const parts: ConjugationPart[] = [];
    
    if (tense === 'past') {
      const suffixes = [
        'َ', 'َا', 'ُوا', 'َتْ', 'َتَا', 'ْنَ', 
        'ْتَ', 'ْتُمَا', 'ْتُمْ', 'ْتِ', 'ْتُمَا', 'ْتُنَّ', 
        'ْتُ', 'ْنَا'
      ];
      
      const stemText = index >= 5 ? basePast.slice(0, -1) + 'ْ' : basePast.slice(0, -1);
      const suffixText = suffixes[index];
      result = stemText + suffixText;

      parts.push({ text: stemText, type: 'root' });
      if (suffixText) parts.push({ text: suffixText, type: 'suffix' });

    } else if (tense === 'present') {
      const prefixes = ['يَ', 'يَ', 'يَ', 'تَ', 'تَ', 'يَ', 'تَ', 'تَ', 'تَ', 'تَ', 'تَ', 'تَ', 'أَ', 'نَ'];
      const suffixes = ['', 'انِ', 'ونَ', '', 'انِ', 'نَ', '', 'انِ', 'ونَ', 'ينَ', 'انِ', 'نَ', '', ''];
      
      const prefixText = prefixes[index];
      const stemText = basePresent.substring(1, basePresent.length - 1); 
      const suffixText = (suffixes[index] || 'ُ');
      result = prefixText + stemText + suffixText;

      parts.push({ text: prefixText, type: 'prefix' });
      parts.push({ text: stemText, type: 'root' });
      parts.push({ text: suffixText, type: 'suffix' });

    } else if (tense === 'future') {
       const presentForms = conjugate(past, present, 'present');
       const p = presentForms[index];
       result = 'سَـ' + p.value;
       parts.push({ text: 'سَـ', type: 'prefix' });
       parts.push(...p.parts);

    } else if (tense === 'imperative') {
       if (index >= 6 && index <= 11) {
          const stemText = basePresent.substring(2, basePresent.length - 1); 
          const impSuffixes = ['', 'ا', 'وا', 'ي', 'ا', 'ن'];
          const suffixText = 'ْ' + impSuffixes[index - 6];
          const raw = stemText + suffixText;
          result = raw.replace('ْا', 'ا').replace('ْوا', 'وا').replace('ْي', 'y').replace('ْن', 'n');
          result = stemText + 'ْ' + impSuffixes[index - 6];
          result = result.replace('ْا', 'ا').replace('ْوا', 'وا').replace('ْي', 'ي').replace('ْن', 'ن');
          
          parts.push({ text: stemText, type: 'root' });
          parts.push({ text: result.replace(stemText, ''), type: 'suffix' });
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
