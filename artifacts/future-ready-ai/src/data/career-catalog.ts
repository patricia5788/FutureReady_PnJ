export type SkillRequirement = {
  id: string;
  name: string;
  description: string;
  requiredLevel: 2 | 3;
  reason: string;
  sourceName: string;
  sourceUrl: string;
};

export type Career = {
  id: string;
  name: string;
  description: string;
  sourceName: string;
  sourceUrl: string;
  sourceNote: string;
  requirements: SkillRequirement[];
};

const onetSoftware = 'https://www.onetonline.org/link/summary/15-1252.00';
const onetData = 'https://www.onetonline.org/link/summary/15-2051.00';
const onetCyber = 'https://www.onetonline.org/link/summary/15-1212.00';
const onetNetwork = 'https://www.onetonline.org/find/career?c=060100';
const esco = 'https://esco.ec.europa.eu/en/classification';

export const careers: Career[] = [
  {
    id: 'software-developer',
    name: 'Software Developer',
    description: 'Designs, tests, and maintains software that addresses user and system needs.',
    sourceName: 'O*NET OnLine — Software Developers',
    sourceUrl: onetSoftware,
    sourceNote: 'The app uses this occupation as a reference for a simplified IT graduate pathway.',
    requirements: [
      { id: 'programming', name: 'Programming', description: 'Write and maintain computer programs.', requiredLevel: 3, reason: 'Build and maintain software.', sourceName: 'O*NET OnLine', sourceUrl: onetSoftware },
      { id: 'problem-solving', name: 'Problem Solving', description: 'Analyze problems and design solutions.', requiredLevel: 3, reason: 'Resolve technical issues.', sourceName: 'O*NET OnLine', sourceUrl: onetSoftware },
      { id: 'software-testing', name: 'Software Testing', description: 'Check that software meets requirements.', requiredLevel: 2, reason: 'Find defects and validate features.', sourceName: 'O*NET OnLine', sourceUrl: onetSoftware },
      { id: 'debugging', name: 'Debugging', description: 'Identify and correct code errors.', requiredLevel: 2, reason: 'Maintain reliable software.', sourceName: 'O*NET OnLine', sourceUrl: onetSoftware },
      { id: 'requirements-analysis', name: 'Requirements Analysis', description: 'Understand user needs and specifications.', requiredLevel: 2, reason: 'Clarify intended software behavior.', sourceName: 'O*NET OnLine', sourceUrl: onetSoftware },
      { id: 'version-control-git', name: 'Version Control (Git)', description: 'Track and coordinate code changes.', requiredLevel: 2, reason: 'Support collaboration and change tracking.', sourceName: 'O*NET OnLine', sourceUrl: onetSoftware },
    ],
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Queries, checks, analyzes, and communicates data to support decisions.',
    sourceName: 'O*NET OnLine — Data Scientists (related occupation)',
    sourceUrl: onetData,
    sourceNote: 'Data Analyst is a simplified pathway; the linked O*NET occupation is a related reference, not an exact title match.',
    requirements: [
      { id: 'sql', name: 'SQL', description: 'Query and organize relational database data.', requiredLevel: 3, reason: 'Extract data for analysis.', sourceName: 'O*NET OnLine', sourceUrl: onetData },
      { id: 'data-cleaning', name: 'Data Cleaning', description: 'Find and correct data quality issues.', requiredLevel: 2, reason: 'Improve the reliability of analysis.', sourceName: 'O*NET OnLine', sourceUrl: onetData },
      { id: 'data-visualisation', name: 'Data Visualisation', description: 'Present data using charts and graphs.', requiredLevel: 2, reason: 'Communicate patterns clearly.', sourceName: 'O*NET OnLine', sourceUrl: onetData },
      { id: 'statistics', name: 'Statistics', description: 'Use statistical methods to understand data.', requiredLevel: 2, reason: 'Interpret patterns and uncertainty.', sourceName: 'O*NET OnLine', sourceUrl: onetData },
      { id: 'critical-thinking', name: 'Critical Thinking', description: 'Evaluate evidence and conclusions.', requiredLevel: 3, reason: 'Avoid misleading interpretations.', sourceName: 'O*NET OnLine', sourceUrl: onetData },
      { id: 'communication', name: 'Communication', description: 'Explain findings to people who use them.', requiredLevel: 2, reason: 'Support informed decisions.', sourceName: 'O*NET OnLine', sourceUrl: onetData },
    ],
  },
  {
    id: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    description: 'Monitors systems and helps teams identify and respond to security risks.',
    sourceName: 'O*NET OnLine — Information Security Analysts',
    sourceUrl: onetCyber,
    sourceNote: 'The linked O*NET occupation is Information Security Analysts, a close reference for this pathway.',
    requirements: [
      { id: 'network-security', name: 'Network Security', description: 'Protect networks from unauthorized access.', requiredLevel: 3, reason: 'Protect systems and information.', sourceName: 'O*NET OnLine', sourceUrl: onetCyber },
      { id: 'threat-detection', name: 'Threat Detection', description: 'Identify suspicious activity and potential threats.', requiredLevel: 3, reason: 'Notice possible security incidents.', sourceName: 'O*NET OnLine', sourceUrl: onetCyber },
      { id: 'risk-assessment', name: 'Risk Assessment', description: 'Evaluate vulnerabilities and security risks.', requiredLevel: 3, reason: 'Help prioritize protective measures.', sourceName: 'O*NET OnLine', sourceUrl: onetCyber },
      { id: 'incident-response', name: 'Incident Response', description: 'Investigate and respond to security incidents.', requiredLevel: 2, reason: 'Limit the impact of incidents.', sourceName: 'O*NET OnLine', sourceUrl: onetCyber },
      { id: 'access-control', name: 'Access Control', description: 'Manage permissions and access to systems.', requiredLevel: 2, reason: 'Reduce unauthorized access.', sourceName: 'O*NET OnLine', sourceUrl: onetCyber },
      { id: 'security-monitoring', name: 'Security Monitoring', description: 'Review logs and security alerts.', requiredLevel: 2, reason: 'Identify unusual activity for review.', sourceName: 'O*NET OnLine', sourceUrl: onetCyber },
    ],
  },
  {
    id: 'cloud-network-engineer',
    name: 'Cloud/Network Engineer',
    description: 'Supports network connectivity and cloud services used by an organization.',
    sourceName: 'O*NET OnLine and ESCO',
    sourceUrl: onetNetwork,
    sourceNote: 'This blended title combines related network and cloud competencies; see the source beside each requirement.',
    requirements: [
      { id: 'networking', name: 'Networking', description: 'Understand IP, DNS, routing, and connectivity.', requiredLevel: 3, reason: 'Configure and troubleshoot networks.', sourceName: 'O*NET OnLine career finder', sourceUrl: onetNetwork },
      { id: 'cloud-computing', name: 'Cloud Computing', description: 'Use cloud infrastructure and services.', requiredLevel: 2, reason: 'Deploy and maintain cloud systems.', sourceName: 'European Commission ESCO', sourceUrl: esco },
      { id: 'linux-operating-systems', name: 'Linux / Operating Systems', description: 'Work with operating systems and command lines.', requiredLevel: 2, reason: 'Maintain servers and systems.', sourceName: 'O*NET OnLine career finder', sourceUrl: onetNetwork },
      { id: 'troubleshooting', name: 'Troubleshooting', description: 'Diagnose system and network failures.', requiredLevel: 3, reason: 'Restore service and investigate faults.', sourceName: 'O*NET OnLine career finder', sourceUrl: onetNetwork },
      { id: 'network-security-cloud', name: 'Network Security', description: 'Configure protections for network infrastructure.', requiredLevel: 2, reason: 'Protect connected systems.', sourceName: 'O*NET OnLine', sourceUrl: onetCyber },
      { id: 'automation-scripting', name: 'Automation / Scripting', description: 'Use scripts to automate repeatable operational tasks.', requiredLevel: 2, reason: 'Reduce repetitive manual operations.', sourceName: 'O*NET OnLine', sourceUrl: onetSoftware },
    ],
  },
  {
    id: 'ai-ml-engineer',
    name: 'AI/Machine Learning Engineer',
    description: 'Prepares data, builds and evaluates models, and integrates them into software.',
    sourceName: 'O*NET OnLine — Data Scientists and Software Developers',
    sourceUrl: onetData,
    sourceNote: 'AI/Machine Learning Engineer is an emerging, blended pathway; linked O*NET occupations are related references, not an exact title match.',
    requirements: [
      { id: 'python-programming', name: 'Python Programming', description: 'Write Python programs for data and AI tasks.', requiredLevel: 3, reason: 'Build data and machine learning applications.', sourceName: 'O*NET OnLine — Data Scientists', sourceUrl: onetData },
      { id: 'statistics-probability', name: 'Statistics & Probability', description: 'Understand statistical and probability concepts.', requiredLevel: 3, reason: 'Interpret data and model behavior.', sourceName: 'O*NET OnLine — Data Scientists', sourceUrl: onetData },
      { id: 'machine-learning', name: 'Machine Learning', description: 'Train and evaluate machine learning models.', requiredLevel: 3, reason: 'Build and assess predictive systems.', sourceName: 'O*NET OnLine — Data Scientists', sourceUrl: onetData },
      { id: 'data-processing', name: 'Data Processing', description: 'Clean and transform data for modeling.', requiredLevel: 3, reason: 'Prepare reliable model inputs.', sourceName: 'O*NET OnLine — Data Scientists', sourceUrl: onetData },
      { id: 'model-evaluation', name: 'Model Evaluation', description: 'Assess model performance using appropriate measures.', requiredLevel: 3, reason: 'Check model quality before use.', sourceName: 'O*NET OnLine — Data Scientists', sourceUrl: onetData },
      { id: 'software-engineering', name: 'Software Engineering', description: 'Develop testable and maintainable software.', requiredLevel: 2, reason: 'Integrate models into applications.', sourceName: 'O*NET OnLine — Software Developers', sourceUrl: onetSoftware },
    ],
  },
];

export function findCareer(careerId: string): Career | undefined {
  return careers.find((career) => career.id === careerId);
}

