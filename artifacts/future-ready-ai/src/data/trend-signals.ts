import { careers } from '@/data/career-catalog';

export type ReportSignal = {
  id: string;
  headline: string;
  relatedCareerIds: string[];
  relatedSkills: string[];
  evidence: string;
  sourceName: string;
  sourceUrl: string;
  publicationDate: string;
  snapshotDate: string;
  limitation: string;
};

const wefSource = 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/3-skills-outlook/';

export const reportSignals: ReportSignal[] = [
  {
    id: 'wef-ai-data',
    headline: 'AI and big data are among the skills employers expect to grow in importance.',
    relatedCareerIds: ['ai-ml-engineer', 'data-analyst'],
    relatedSkills: ['Python Programming', 'Machine Learning', 'Data Processing'],
    evidence: 'A global employer survey and outlook through 2030; this is a forecast, not a live vacancy count.',
    sourceName: 'World Economic Forum — Future of Jobs Report 2025',
    sourceUrl: wefSource,
    publicationDate: 'January 2025',
    snapshotDate: '21 October 2026 (date recorded in supplied CSV)',
    limitation: 'Global employer expectations; not a real-time or Malaysia-specific measure.',
  },
  {
    id: 'wef-cyber',
    headline: 'Networks and cybersecurity are among the technology skills expected to gain importance.',
    relatedCareerIds: ['cybersecurity-analyst', 'cloud-network-engineer'],
    relatedSkills: ['Network Security', 'Networking', 'Threat Detection'],
    evidence: 'The report lists networks and cybersecurity among the fastest-growing skill areas through 2030.',
    sourceName: 'World Economic Forum — Future of Jobs Report 2025',
    sourceUrl: wefSource,
    publicationDate: 'January 2025',
    snapshotDate: '21 October 2026 (date recorded in supplied CSV)',
    limitation: 'Global employer expectations; not a real-time or Malaysia-specific measure.',
  },
  {
    id: 'wef-tech-literacy',
    headline: 'Technological literacy is also identified as a skill gaining importance.',
    relatedCareerIds: careers.map((career) => career.id),
    relatedSkills: ['Programming', 'Cloud Computing', 'Python Programming'],
    evidence: 'The report includes technological literacy among core skills employers expect to matter.',
    sourceName: 'World Economic Forum — Future of Jobs Report 2025',
    sourceUrl: wefSource,
    publicationDate: 'January 2025',
    snapshotDate: '21 October 2026 (date recorded in supplied CSV)',
    limitation: 'Global employer expectations; not a real-time or Malaysia-specific measure.',
  },
  {
    id: 'malaysia-ict',
    headline: 'A Malaysia report describes higher ICT-related job-posting activity in 2025.',
    relatedCareerIds: careers.map((career) => career.id),
    relatedSkills: ['Python Programming', 'Network Security', 'Data Visualisation'],
    evidence: 'The Edge Malaysia reports a nearly 25% year-on-year increase in ICT-related postings in 2025, quoting JobStreet by SEEK Malaysia. This is a reported snapshot, not a complete job-market measure.',
    sourceName: 'The Edge Malaysia, quoting JobStreet by SEEK Malaysia',
    sourceUrl: 'https://theedgemalaysia.com/node/791561',
    publicationDate: 'February 2026 (source date recorded in supplied CSV)',
    snapshotDate: '21 October 2026 (date recorded in supplied CSV)',
    limitation: 'One media report about postings in 2025; not comprehensive, and not a guarantee of hiring outcomes.',
  },
];

