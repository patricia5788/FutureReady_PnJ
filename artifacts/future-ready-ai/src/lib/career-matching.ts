import type { Career, SkillRequirement } from '@/data/career-catalog';
import type { Profile, ProfileSkill } from '@/lib/profile';
import { skillLevelValue } from '@/lib/profile';

export type RequirementStatus = 'met' | 'developing' | 'not-provided';

export type RequirementAssessment = {
  requirement: SkillRequirement;
  status: RequirementStatus;
  profileSkill?: ProfileSkill;
  points?: number;
};

export type CareerMatch = {
  career: Career;
  score: number | null;
  assessedCount: number;
  totalRequirements: number;
  met: RequirementAssessment[];
  developing: RequirementAssessment[];
  unprovided: RequirementAssessment[];
  assessments: RequirementAssessment[];
};

const explicitAliases: Record<string, string> = {
  'python': 'python programming',
  'python programming': 'python programming',
  'problem solving': 'problem solving',
  'data visualization': 'data visualisation',
  'data visualisation': 'data visualisation',
  'statistics and probability': 'statistics probability',
  'statistics probability': 'statistics probability',
  'statistical analysis': 'statistics',
  'machine learning algorithms': 'machine learning',
  'ml': 'machine learning',
  'data preprocessing': 'data processing',
  'networking protocols': 'networking',
  'cloud platforms aws azure': 'cloud computing',
  'cloud': 'cloud computing',
  'version control': 'version control git',
  'git': 'version control git',
  'version control git': 'version control git',
  'software development': 'software engineering',
  'software engineering': 'software engineering',
  'threat analysis': 'threat detection',
  'threat detection': 'threat detection',
  'access controls': 'access control',
  'access control': 'access control',
};

export function normalizeSkillName(name: string): string {
  const key = name
    .normalize('NFKD')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  return explicitAliases[key] ?? key;
}

function highestProfileSkill(
  skills: ProfileSkill[],
  requirementName: string,
): ProfileSkill | undefined {
  const matchKey = normalizeSkillName(requirementName);
  return skills
    .filter((skill) => skill.name.trim() && normalizeSkillName(skill.name) === matchKey)
    .sort((left, right) => skillLevelValue[right.level] - skillLevelValue[left.level])[0];
}

export function analyzeCareer(profile: Profile, career: Career): CareerMatch {
  const assessments = career.requirements.map((requirement): RequirementAssessment => {
    const profileSkill = highestProfileSkill(profile.skills, requirement.name);
    if (!profileSkill) return { requirement, status: 'not-provided' };

    const points = Math.round(
      Math.min(1, skillLevelValue[profileSkill.level] / requirement.requiredLevel) * 100,
    );

    return {
      requirement,
      profileSkill,
      points,
      status: skillLevelValue[profileSkill.level] >= requirement.requiredLevel ? 'met' : 'developing',
    };
  });

  const assessed = assessments.filter((assessment) => assessment.points !== undefined);
  const score = assessed.length
    ? Math.round(assessed.reduce((sum, item) => sum + (item.points ?? 0), 0) / assessed.length)
    : null;

  return {
    career,
    score,
    assessedCount: assessed.length,
    totalRequirements: career.requirements.length,
    met: assessments.filter((assessment) => assessment.status === 'met'),
    developing: assessments.filter((assessment) => assessment.status === 'developing'),
    unprovided: assessments.filter((assessment) => assessment.status === 'not-provided'),
    assessments,
  };
}

export function rankCareerMatches(profile: Profile, careers: Career[]): CareerMatch[] {
  return careers
    .map((career) => analyzeCareer(profile, career))
    .sort((left, right) => {
      if (left.score === null && right.score !== null) return 1;
      if (right.score === null && left.score !== null) return -1;
      return (right.score ?? -1) - (left.score ?? -1) || right.assessedCount - left.assessedCount;
    });
}

