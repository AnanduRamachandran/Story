// Grouped, annotated links — each item is a hyperlink with a short
// description as its visible text. Replace the examples below.

export type LinkItem = {
  text: string;
  href: string;
};

export type LinkSection = {
  title: string;
  items: LinkItem[];
};

export const linkSections: LinkSection[] = [
  {
    title: 'Essays',
    items: [
      {
        text: 'Example essay title — replace with a real link',
        href: '#',
      },
    ],
  },
  {
    title: 'Blogs',
    items: [
      {
        text: 'Example blog post — replace with a real link',
        href: '#',
      },
    ],
  },
  {
    title: 'Videos',
    items: [
      {
        text: 'Example YouTube video — replace with a real link',
        href: '#',
      },
    ],
  },
  {
    title: 'Elsewhere',
    items: [
      { text: 'GitHub', href: 'https://github.com/AnanduRamachandran' },
      { text: 'Email', href: 'mailto:ananduyou@gmail.com' },
    ],
  },
];
