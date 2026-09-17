export type Role = {
  title: string;
  period: string;
  points: string[];
};

export type WorkEntry = {
  org: string;
  location: string;
  roles: Role[];
};

export const experience: WorkEntry[] = [
  {
    org: 'SOTI',
    location: 'Kochi, Kerala',
    roles: [
      {
        title: 'Software Developer 2',
        period: 'Aug 2026 — Present',
        points: [
          'Took on expanded code review responsibilities across the Windows Platform team, extending beyond primary reviewer duties held in the prior role.',
        ],
      },
      {
        title: 'Software Developer 1',
        period: 'Aug 2024 — Aug 2026',
        points: [
          'Led the design and completed development of 1 XXL-sized Epic and 2 L-scoped Epics, and co-owned several other epics — project planning, management, and delivery.',
          'Owned architecture and security design for all the above epics, ensuring compliance and facilitating design/compliance meetings.',
          'Served as primary code reviewer for the Windows Platform team, upholding code quality and consistency standards.',
          'Led cross-team architecture reviews, enforcing low-level code and mid-level architecture guidelines.',
          'Recognized as subject matter expert across multiple Windows Platform features.',
          "One of only two engineers on the team granted merge access to SOTI's NuGet repositories.",
        ],
      },
      {
        title: 'Associate Software Developer',
        period: 'Aug 2022 — Aug 2024',
        points: [
          'Built full-stack features for the Windows Platform team using C#, ASP.NET Framework/Core, WPF, Angular, SQL Server, and Git — spanning device-side and backend components.',
          'Took on architecture and compliance review responsibilities for other teams alongside core feature work.',
          'Epic owner (lead developer) for Windows Hello, Single App Kiosk Mode within the native lockdown app, and Classic App (.msi) deployment for Windows.',
          'Primary point of contact for teams integrating with the Windows Configuration Service Provider (CSP) protocol used to deploy MDM configurations.',
        ],
      },
    ],
  },
];

export const achievements = [
  {
    title: 'SOTI MVP Nominee',
    meta: "23–24, 24–25",
    description:
      'Awarded to the top 10% of 1,300+ developers company-wide; nominees are the top achievers selected from within their team.',
  },
  {
    title: 'SOTI Tech Dynamo',
    meta: null,
    description: 'Awarded for exceptional skills within the team for software development knowledge.',
  },
];

export const education = [
  {
    school: 'IHRD College of Engineering, Chengannur',
    location: 'Chengannur, Kerala',
    credential: 'B.Tech, Electronics and Instrumentation Engineering — GPA: 8.01',
    period: 'Aug 2022',
  },
];

export const skills = [
  'Backend Development',
  'C#',
  '.NET Framework',
  '.NET Core',
  'SQL',
  'C++',
  'TypeScript',
  'JavaScript',
  'Angular',
  'SOLID Principles',
  'Unit Testing',
  'Windows OS & System APIs',
  'Windows Registry',
  'Windows Server',
  'Microsoft Azure (MDM & AD basics)',
  'Git/GitHub',
  'Architecture & Security Design',
  'Code Review',
  'Cross-Team Compliance Review',
  'Agile Delivery',
  'CI/CD',
];
