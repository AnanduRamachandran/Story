// A running list, not a curated shelf — add to this as you read.
// No particular order. `status` drives the small marker in the UI.

export type Book = {
  title: string;
  author: string;
  status: 'reading' | 'read';
  note?: string;
};

export const books: Book[] = [
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    status: 'read',
  },
  {
    title: 'Artemis Fowl',
    author: 'Eoin Colfer',
    status: 'read',
  },
  {
    title: 'The Valkyries',
    author: 'Paulo Coelho',
    status: 'read',
  },
  {
    title: 'മൃതസഞ്ജീവനി',
    author: 'Chandramati Ayoor',
    status: 'read',
  },
  {
    title: 'Six of Crows',
    author: 'Leigh Bardugo',
    status: 'read',
  },
  {
    title: 'Crooked Kingdom',
    author: 'Leigh Bardugo',
    status: 'read',
  },
  {
    title: 'When Breath Becomes Air',
    author: 'Paul Kalanithi',
    status: 'read',
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    status: 'read',
  },
  {
    title: 'The God of Small Things',
    author: 'Arundhati Roy',
    status: 'read',
  },
  {
    title: 'Kafka on the Shore',
    author: 'Haruki Murakami',
    status: 'read',
  },
  {
    title: 'Five Point Someone',
    author: 'Chetan Bhagat',
    status: 'read',
  },
  {
    title: 'Revolution 2020',
    author: 'Chetan Bhagat',
    status: 'read',
  },
  {
    title: 'The Kite Runner',
    author: 'Khaled Hosseini',
    status: 'read',
  },
  {
    title: 'A Thousand Splendid Suns',
    author: 'Khaled Hosseini',
    status: 'read',
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    status: 'read',
  },
  {
    title: 'The Ocean at the End of the Lane',
    author: 'Neil Gaiman',
    status: 'read',
  },
  {
    title: 'രണ്ടാമൂഴം',
    author: 'M.T. Vasudevan Nair',
    status: 'read',
  },
  {
    title: 'Shoe Dog',
    author: 'Phil Knight',
    status: 'read',
  },
  {
    title: 'The Richest Man in Babylon',
    author: 'George S. Clason',
    status: 'read',
  },
  {
    title: 'Goat Days',
    author: 'Benyamin',
    status: 'read',
  },
  {
    title: "Man's Search for Meaning",
    author: 'Viktor E. Frankl',
    status: 'read',
  },
  {
    title: 'ഖസാക്കിന്റെ ഇതിഹാസം',
    author: 'O.V. Vijayan',
    status: 'read',
  },
];
