export type QuoteCategory = 'DevOps' | 'Engineering' | 'Life';

export interface QuoteSchema {
  text: string;
  author: string;
  source?: string;
  category: QuoteCategory;
  // Optional line on why the quote matters to you.
  note?: string;
  // The featured quote is shown large at the top of the page.
  featured?: boolean;
}
