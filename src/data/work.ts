export type Role = {
  title: string;
  period: string;
  summary: string;
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
        summary:
          'Took on expanded code review responsibilities across the Windows Platform team, building on the primary reviewer role held previously.',
      },
      {
        title: 'Software Developer 1',
        period: 'Aug 2024 — Aug 2026',
        summary:
          'Led design and delivery across several epics, owning architecture, security, and compliance end to end. Served as primary code reviewer and led cross-team architecture reviews for the Windows Platform team, and was recognized as subject matter expert across multiple features.',
      },
      {
        title: 'Associate Software Developer',
        period: 'Aug 2022 — Aug 2024',
        summary:
          'Built full-stack features for the Windows Platform team — from device-side components to backend services — using C#, ASP.NET, WPF, Angular, and SQL Server. Owned Windows Hello, Single App Kiosk Mode, and Classic App deployment as epic lead, and was the primary point of contact for teams integrating with the Windows Configuration Service Provider protocol.',
      },
    ],
  },
];
