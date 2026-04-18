import { conjugate } from '../lib/conjugator';

function testVerb(past: string, present: string, label: string) {
  console.log(`\n--- Testing ${label}: ${past} ---`);
  
  const pastConjugation = conjugate(past, present, 'past');
  console.log(`Madhi (Huwa): ${pastConjugation[0].value}`);
  console.log(`Madhi (Hunna - expect I'lal/Fakk): ${pastConjugation[5].value}`);
  console.log(`Madhi (Anta): ${pastConjugation[6].value}`);

  const presentConjugation = conjugate(past, present, 'present');
  const manshub = conjugate(past, present, 'present_manshub');
  const majzum = conjugate(past, present, 'present_majzum');
  
  console.log(`Mudhari (Huwa): ${presentConjugation[0].value}`);
  console.log(`Manshub (Huwa): ${manshub[0].value}`);
  console.log(`Majzum (Huwa): ${majzum[0].value}`);
  
  const imperative = conjugate(past, present, 'imperative');
  console.log(`Amr (Anta): ${imperative[6].value}`);
}

// 1. Shahih
testVerb('كَتَبَ', 'يَكْتُبُ', 'SHAHIH');

// 2. Ajwaf (Wawi)
testVerb('قَالَ', 'يَقُولُ', 'AJWAF');

// 3. Mudha'af
testVerb('مَدَّ', 'يَمُدُّ', 'MUDHA\'AF');

// 4. Naqish
testVerb('رَمَى', 'يَرْمِي', 'NAQISH');
