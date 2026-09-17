// A running list, not a curated shelf — add to this as you read.
// Newest entries first. `status` drives the small marker in the UI.

export type Book = {
  title: string;
  author: string;
  status: 'reading' | 'read';
  note?: string;
};

// Replace these examples with your actual reads.
export const books: Book[] = [
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    status: 'reading',
    note: 'Example entry — replace with your own list.',
  },
  {
    title: 'Zen and the Art of Motorcycle Maintenance',
    author: 'Robert M. Pirsig',
    status: 'read',
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    status: 'read',
  },
];
