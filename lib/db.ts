import Dexie, { type Table } from 'dexie';

export interface Example {
  ar: string;
  id: string;
}

export interface Verb {
  id?: number;
  root: string; // e.g. و-ق-ع
  past: string; // e.g. وَقَعَ
  present: string; // e.g. يَقَعُ
  masdar?: string; // e.g. وُقُوْعًا
  activeParticiple?: string; // Isim Fail
  passiveParticiple?: string; // Isim Maf'ul
  nounPlaceTime?: string; // Isim Makan/Zaman
  toolNoun?: string; // Isim Alah
  wazan: string; 
  type: 'shahih' | 'mithal' | 'ajwaf' | 'naqis' | 'lafif';
  isMazid?: boolean;
  translationId: string;
  examples?: Example[];
  forms?: any[]; // To store custom conjugations
  isFavorite: boolean;
  createdAt: number;
}

export interface Progress {
  id?: number;
  verbId: number;
  score: number;
  attempts: number;
  lastPracticed: number;
}

export interface QuizResult {
  id?: number;
  totalQuestions: number;
  correctAnswers: number;
  timestamp: number;
}

export class TashrifDatabase extends Dexie {
  verbs!: Table<Verb>;
  progress!: Table<Progress>;
  quizResults!: Table<QuizResult>;

  constructor() {
    super('TashrifDB');
    this.version(1).stores({
      verbs: '++id, root, past, present, type, isFavorite',
      progress: '++id, verbId, lastPracticed',
      quizResults: '++id, timestamp'
    });
  }
}

export const db = new TashrifDatabase();

// Seed data
export const seedVerbs = async () => {
  const count = await db.verbs.count();
  if (count === 0) {
    await db.verbs.bulkAdd([
      {
        root: 'و-ق-ع',
        past: 'وَقَعَ',
        present: 'يَقَعُ',
        masdar: 'وُقُوعًا',
        activeParticiple: 'وَاقِع',
        passiveParticiple: 'مَوْقُوع',
        nounPlaceTime: 'مَوْقِع',
        wazan: 'فَعَلَ - يَفْعَلُ',
        type: 'mithal',
        translationId: 'jatuh / terletak',
        examples: [
          { ar: 'وَقَعَ الكِتَابُ عَلَى السَّجَّادَةِ', id: 'Buku itu jatuh di atas karpet' },
          { ar: 'قَلْبُ المَدِينَةِ يَقَعُ هُنَا', id: 'Pusat kota terletak di sini' }
        ],
        isFavorite: true,
        createdAt: Date.now()
      },
      {
        root: 'ك-ت-ب',
        past: 'كَتَبَ',
        present: 'يَكْتُبُ',
        masdar: 'كِتَابَةً',
        activeParticiple: 'كَاتِب',
        passiveParticiple: 'مَكْتُوب',
        nounPlaceTime: 'مَكْتَب',
        toolNoun: 'مِكْتَب',
        wazan: 'فَعَلَ - يَفْعُلُ',
        type: 'shahih',
        translationId: 'menulis',
        examples: [
          { ar: 'كَتَبَ الطَّالِبُ الدَّرْسَ', id: 'Siswa itu menulis pelajaran' }
        ],
        isFavorite: false,
        createdAt: Date.now()
      },
      {
        root: 'ع-ل-م',
        past: 'عَلَّمَ',
        present: 'يُعَلِّمُ',
        masdar: 'تَعْلِيْمًا',
        activeParticiple: 'مُعَلِّم',
        passiveParticiple: 'مُعَلَّم',
        wazan: 'فَعَّلَ - يُفَعِّلُ',
        type: 'shahih',
        isMazid: true,
        translationId: 'mengajar',
        examples: [
          { ar: 'يُعَلِّمُ الأُسْتَاذُ اللُّغَةَ العَرَبِيَّةَ', id: 'Ustadz mengajar bahasa Arab' }
        ],
        isFavorite: false,
        createdAt: Date.now()
      }
    ]);
  }
};
