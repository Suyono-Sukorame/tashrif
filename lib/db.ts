import Dexie, { type Table } from 'dexie';

export interface Verb {
  id?: number;
  root: string; // e.g. و-ق-ع
  past: string; // e.g. وقع
  present: string; // e.g. يقع
  wazan: string; // e.g. فعل - يفعل
  type: 'shahih' | 'mithal' | 'ajwaf' | 'naqis' | 'lafif';
  translationId: string;
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
        wazan: 'فَعَلَ - يَفْعَلُ',
        type: 'mithal',
        translationId: 'jatuh / terletak',
        isFavorite: true,
        createdAt: Date.now()
      },
      {
        root: 'ك-ت-ب',
        past: 'كَتَبَ',
        present: 'يَكْتُبُ',
        wazan: 'فَعَلَ - يَفْعُلُ',
        type: 'shahih',
        translationId: 'menulis',
        isFavorite: false,
        createdAt: Date.now()
      },
      {
        root: 'ق-ا-ل',
        past: 'قَالَ',
        present: 'يَقُولُ',
        wazan: 'فَعَلَ - يَفْعُلُ',
        type: 'ajwaf',
        translationId: 'berkata',
        isFavorite: false,
        createdAt: Date.now()
      }
    ]);
  }
};
