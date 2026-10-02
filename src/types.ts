export type QuestionType = "fill-blank" | "reorder" | "find-error";

export interface Question {
  id: string;
  type: QuestionType;
  sentence: string; // "My mom ___ a nurse." or correct ordered sentence
  options?: string[]; // ["am", "is", "are"] for fill-blank
  correctAnswer?: string; // "is"
  words?: string[]; // ["happy", "are", "They"] for reorder
  sentenceWithError?: string; // "We is study English."
  errorWord?: string; // "is"
  correctWord?: string; // "are"
  translation: string; // "Mẹ tớ là một y tá."
  explanation: string; // "Vì S là 'My mom' (số ít) nên động từ 'to be' là 'is'."
}

export interface Level {
  id: string;
  title: string;
  vietnameseTitle: string;
  description: string;
  emoji: string;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  questions: Question[];
  rewardCoins: number;
}

export interface UserStats {
  coins: number;
  completedLevels: string[]; // Level IDs
  streak: number;
  lastActiveDate: string | null;
  highScore: number;
  avatar: string; // "bee" | "cat" | "wizard"
  unlockedAvatars: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

export interface HighScoreEntry {
  name: string;
  score: number;
  date: string;
  avatar: string;
}
