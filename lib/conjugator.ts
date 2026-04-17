/**
 * Advanced Arabic Verb Conjugation Engine
 * This is a simplified but robust version for the enterprise app.
 * In a real-world scenario, this would handle complex morphophonological rules.
 */

export type Tense = 'past' | 'present' | 'present_manshub' | 'present_majzum' | 'imperative' | 'future';

export interface ConjugationResult {
  dhamir: string;
  pronoun: string;
  value: string;
  translation: string;
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
  // Stripping harakat for logical processing (simplified)
  // In a full enterprise engine, we'd use a more sophisticated approach
  
  const results: ConjugationResult[] = [];

  // Logic for 'WAQA'A - YAQAU' (Mithal)
  const isMithalWaw = past.startsWith('وَ');
  const basePast = past; // e.g. وَقَعَ
  const basePresent = present; // e.g. يَقَعُ
  
  DHAMIRS.forEach((d, index) => {
    let result = '';
    
    if (tense === 'past') {
      // Basic Past Conjugation Rules
      const roots = basePast.replace(/[َُِّْ]/g, ''); // Simplified root extraction
      const char1 = basePast[0];
      const char2 = basePast[2]; // Simplified mapping
      const char3 = basePast[4];
      
      const suffixes = [
        'َ', 'َا', 'ُوا', 'َتْ', 'َتَا', 'ْنَ', 
        'ْتَ', 'ْتُمَا', 'ْتُمْ', 'ْتِ', 'ْتُمَا', 'ْتُنَّ', 
        'ْتُ', 'ْنَا'
      ];
      
      // Handle the "sukun" on the 3rd root letter for some dhamirs
      if (index >= 5) { // From Hunna onwards
         // Strip the last harakah and add sukun then suffix
         const stem = basePast.slice(0, -1) + 'ْ';
         result = stem + suffixes[index];
      } else {
         result = basePast.slice(0, -1) + suffixes[index];
      }
    } else if (tense === 'present') {
      const prefixes = ['يَ', 'يَ', 'يَ', 'تَ', 'تَ', 'يَ', 'تَ', 'تَ', 'تَ', 'تَ', 'تَ', 'تَ', 'أَ', 'نَ'];
      const suffixes = ['', 'انِ', 'ونَ', '', 'انِ', 'نَ', '', 'انِ', 'ونَ', 'ينَ', 'انِ', 'نَ', '', ''];
      
      // Present stem usually removes 'Ya' from base present
      const stem = basePresent.substring(1, basePresent.length - 1); 
      result = prefixes[index] + stem + (suffixes[index] || 'ُ');
    } else if (tense === 'future') {
       // Just add 'لن' (lan) - though lan changes target to manshub
       // For simple UI, we prefix 'سَوْفَ' or 'سَـ'
       const presentForms = conjugate(past, present, 'present');
       result = 'سَـ' + presentForms[index].value;
    } else if (tense === 'imperative') {
       // Only for Anta, Antuma, Antum, Anti, Antunna
       const antaIndex = 6;
       if (index >= 6 && index <= 11) {
          const stem = basePresent.substring(2, basePresent.length - 1); // e.g. قَع
          const impSuffixes = ['', 'ا', 'وا', 'ي', 'ا', 'ن'];
          result = stem + 'ْ' + impSuffixes[index - 6];
          // Remove redundant sukun if vowel is there
          result = result.replace('ْا', 'ا').replace('ْوا', 'وا').replace('ْي', 'ي').replace('ْن', 'ن');
       } else {
          result = '-';
       }
    }

    results.push({
      dhamir: d.ar,
      pronoun: d.en,
      value: result,
      translation: '' // Can be populated later
    });
  });

  return results;
}
