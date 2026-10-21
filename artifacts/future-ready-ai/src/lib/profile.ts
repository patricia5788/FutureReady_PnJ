export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ProfileSkill = {
  name: string;
  level: SkillLevel;
  experience: string;
};

export type Profile = {
  education: string;
  experience: string;
  interests: string;
  goals: string;
  targetCareer: string;
  skills: ProfileSkill[];
};

export const emptyProfile = (): Profile => ({
  education: '',
  experience: '',
  interests: '',
  goals: '',
  targetCareer: '',
  skills: [],
});

export const syntheticGraduateProfile: Profile = {
  education: 'BSc in Information Technology (synthetic example)',
  experience: 'Fresh graduate',
  interests: 'Data analysis, software development, cybersecurity, and practical AI',
  goals: 'Explore entry-level IT roles and build evidence of practical skills.',
  targetCareer: 'data-analyst',
  skills: [
    { name: 'Programming', level: 'Intermediate', experience: '1–2 years' },
    { name: 'Problem Solving', level: 'Intermediate', experience: '1–2 years' },
    { name: 'SQL', level: 'Beginner', experience: 'Under 1 year' },
    { name: 'Data Visualisation', level: 'Beginner', experience: 'Under 1 year' },
    { name: 'Python', level: 'Beginner', experience: 'Under 1 year' },
  ],
};

const previousDemoSkills = ['Research & synthesis', 'Writing', 'Spreadsheets'];
const previousDemoGoals =
  'Explore roles that combine communication, research, and practical AI tools.';

function migrateLevel(level: unknown): SkillLevel {
  if (level === 'Advanced' || level === 'Confident') return 'Advanced';
  if (level === 'Intermediate' || level === 'Growing') return 'Intermediate';
  return 'Beginner';
}

export function normalizeProfile(value: unknown): Profile {
  if (!value || typeof value !== 'object') return emptyProfile();

  const raw = value as Record<string, unknown>;
  const rawSkills = Array.isArray(raw.skills) ? raw.skills : [];
  const skills = rawSkills
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((skill) => ({
      name: typeof skill.name === 'string' ? skill.name.trim() : '',
      level: migrateLevel(skill.level),
      experience: typeof skill.experience === 'string' ? skill.experience : '',
    }))
    .filter((skill) => skill.name.length > 0);

  const isPreviousAutoFilledDemo =
    !raw.education &&
    raw.goals === previousDemoGoals &&
    skills.length === previousDemoSkills.length &&
    previousDemoSkills.every((name, index) => skills[index]?.name === name);

  if (isPreviousAutoFilledDemo) return emptyProfile();

  return {
    education: typeof raw.education === 'string' ? raw.education : '',
    experience: typeof raw.experience === 'string' ? raw.experience : '',
    interests: typeof raw.interests === 'string' ? raw.interests : '',
    goals: typeof raw.goals === 'string' ? raw.goals : '',
    targetCareer: typeof raw.targetCareer === 'string' ? raw.targetCareer : '',
    skills,
  };
}

export function loadProfile(): Profile {
  try {
    const saved = localStorage.getItem('future-ready-profile');
    return saved ? normalizeProfile(JSON.parse(saved)) : emptyProfile();
  } catch {
    return emptyProfile();
  }
}

export function saveProfile(profile: Profile): void {
  try {
    localStorage.setItem('future-ready-profile', JSON.stringify(profile));
  } catch {
    // Keep the in-memory profile available if browser storage is disabled.
  }
}

export const skillLevelValue: Record<SkillLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

