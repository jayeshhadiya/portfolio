import { QuoteSchema } from '@data/schema/quote.schema';

// Add, remove or reorder quotes here. Mark one with `featured: true` to show it at the top.
const quotesData: QuoteSchema[] = [
  {
    text: 'Everything fails, all the time.',
    author: 'Werner Vogels',
    source: 'CTO, Amazon',
    category: 'DevOps',
    note: 'The reason every system I build has health checks, retries and alerts.',
    featured: true,
  },
  {
    text: 'You build it, you run it.',
    author: 'Werner Vogels',
    source: 'ACM Queue interview, 2006',
    category: 'DevOps',
  },
  {
    text: 'If it hurts, do it more frequently, and bring the pain forward.',
    author: 'Jez Humble',
    source: 'Continuous Delivery',
    category: 'DevOps',
  },
  {
    text: 'Simplicity is prerequisite for reliability.',
    author: 'Edsger W. Dijkstra',
    category: 'Engineering',
  },
  {
    text: 'Talk is cheap. Show me the code.',
    author: 'Linus Torvalds',
    category: 'Engineering',
  },
  {
    text: 'Premature optimization is the root of all evil.',
    author: 'Donald Knuth',
    source: 'Structured Programming with go to Statements',
    category: 'Engineering',
  },
  {
    text: 'Programs must be written for people to read, and only incidentally for machines to execute.',
    author: 'Harold Abelson & Gerald Jay Sussman',
    source: 'Structure and Interpretation of Computer Programs',
    category: 'Engineering',
  },
  {
    text: 'The best way to predict the future is to invent it.',
    author: 'Alan Kay',
    category: 'Life',
  },
  {
    text: 'Arise, awake, and stop not till the goal is reached.',
    author: 'Swami Vivekananda',
    category: 'Life',
  },
  {
    text: 'You have a right to perform your duty, but never to the fruits of your actions.',
    author: 'Bhagavad Gita',
    source: 'Chapter 2, Verse 47',
    category: 'Life',
  },
  {
    text: 'Where the mind is without fear and the head is held high.',
    author: 'Rabindranath Tagore',
    source: 'Gitanjali',
    category: 'Life',
  },
  {
    text: 'Strength does not come from physical capacity. It comes from an indomitable will.',
    author: 'Mahatma Gandhi',
    category: 'Life',
  },
  {
    text: 'The journey of a thousand miles begins with one step.',
    author: 'Lao Tzu',
    source: 'Tao Te Ching',
    category: 'Life',
  },
  {
    text: 'It is not that we have a short time to live, but that we waste a lot of it.',
    author: 'Seneca',
    source: 'On the Shortness of Life',
    category: 'Life',
  },
  {
    text: 'Waste no more time arguing about what a good man should be. Be one.',
    author: 'Marcus Aurelius',
    source: 'Meditations',
    category: 'Life',
  },
  {
    text: 'The unexamined life is not worth living.',
    author: 'Socrates',
    source: 'Plato, Apology',
    category: 'Life',
  },
  {
    text: 'Life can only be understood backwards; but it must be lived forwards.',
    author: 'Søren Kierkegaard',
    category: 'Life',
  },
  {
    text: 'He who has a why to live can bear almost any how.',
    author: 'Friedrich Nietzsche',
    source: 'Twilight of the Idols',
    category: 'Life',
  },
  {
    text: 'Everything can be taken from a man but one thing: the last of the human freedoms, to choose one\'s attitude in any given set of circumstances.',
    author: 'Viktor E. Frankl',
    source: 'Man\'s Search for Meaning',
    category: 'Life',
  },
  {
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    source: 'Stanford commencement speech, 2005',
    category: 'Life',
  },
];

export default quotesData;
