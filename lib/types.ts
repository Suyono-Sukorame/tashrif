import { type Verb } from '@/lib/db';

export type ActiveTab = 'home' | 'learn' | 'ai' | 'settings' | 'quiz' | 'guide' | 'access';

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: string;
}
