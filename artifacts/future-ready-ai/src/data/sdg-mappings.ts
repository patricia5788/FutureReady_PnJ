export type SdgMapping = {
  careerId: string;
  goalNumber: 4 | 8 | 9;
  goalName: string;
  explanation: string;
  relatedSkills: string[];
  sourceName: string;
  sourceUrl: string;
  limitation: string;
};

const potentialOnly =
  'Potential contribution only. This is a team-defined connection to the UN goal, not evidence that a job or skill guarantees impact.';

export const sdgMappings: SdgMapping[] = [
  {
    careerId: 'software-developer',
    goalNumber: 9,
    goalName: 'Industry, Innovation and Infrastructure',
    explanation: 'Software skills can contribute to useful digital tools and infrastructure when applied to a real need and designed responsibly.',
    relatedSkills: ['Programming', 'Software Testing', 'Version Control (Git)'],
    sourceName: 'United Nations — Goal 9',
    sourceUrl: 'https://sdgs.un.org/goals/goal9',
    limitation: potentialOnly,
  },
  {
    careerId: 'data-analyst',
    goalNumber: 8,
    goalName: 'Decent Work and Economic Growth',
    explanation: 'Careful data analysis can help organizations understand work and productivity questions; the outcome depends on how the analysis is used.',
    relatedSkills: ['SQL', 'Data Cleaning', 'Statistics', 'Communication'],
    sourceName: 'United Nations — Goal 8',
    sourceUrl: 'https://sdgs.un.org/goals/goal8',
    limitation: potentialOnly,
  },
  {
    careerId: 'cybersecurity-analyst',
    goalNumber: 9,
    goalName: 'Industry, Innovation and Infrastructure',
    explanation: 'Security work can help protect digital infrastructure that people and organizations rely on.',
    relatedSkills: ['Network Security', 'Threat Detection', 'Incident Response'],
    sourceName: 'United Nations — Goal 9',
    sourceUrl: 'https://sdgs.un.org/goals/goal9',
    limitation: potentialOnly,
  },
  {
    careerId: 'cloud-network-engineer',
    goalNumber: 9,
    goalName: 'Industry, Innovation and Infrastructure',
    explanation: 'Reliable network and cloud infrastructure can support access to digital services and innovation.',
    relatedSkills: ['Networking', 'Cloud Computing', 'Troubleshooting'],
    sourceName: 'United Nations — Goal 9',
    sourceUrl: 'https://sdgs.un.org/goals/goal9',
    limitation: potentialOnly,
  },
  {
    careerId: 'ai-ml-engineer',
    goalNumber: 9,
    goalName: 'Industry, Innovation and Infrastructure',
    explanation: 'AI systems may support new products or infrastructure when they solve a defined need and are evaluated responsibly.',
    relatedSkills: ['Python Programming', 'Machine Learning', 'Model Evaluation'],
    sourceName: 'United Nations — Goal 9',
    sourceUrl: 'https://sdgs.un.org/goals/goal9',
    limitation: potentialOnly,
  },
  {
    careerId: 'ai-ml-engineer',
    goalNumber: 4,
    goalName: 'Quality Education',
    explanation: 'AI tools may support educational services, but access, learning quality, privacy, and human support must be considered.',
    relatedSkills: ['Data Processing', 'Model Evaluation', 'Software Engineering'],
    sourceName: 'United Nations — Goal 4',
    sourceUrl: 'https://sdgs.un.org/goals/goal4',
    limitation: potentialOnly,
  },
];

