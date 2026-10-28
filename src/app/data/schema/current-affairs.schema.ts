export interface CurrentAffairsQuestion {
  question: string;
  options: string[];
  // Index into `options` of the correct answer.
  answer: number;
  // Short fact shown after answering.
  explanation?: string;
  category?: string;
}

export interface CurrentAffairsDay {
  // YYYY-MM-DD
  date: string;
  questions: CurrentAffairsQuestion[];
  // Where the facts came from, shown under the quiz.
  sources?: { name: string; url: string }[];
}
