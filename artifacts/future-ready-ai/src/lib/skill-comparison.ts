export type ProfileSkill = {
  name: string;
  level: string;
};

export type RadarSkill = {
  name: string;
  demand: number;
  direction: string;
  note: string;
};

export type SkillComparison = {
  radarSkill: RadarSkill;
  profileSkill?: ProfileSkill;
  hasProfileSkill: boolean;
  proficiency: string;
  needsImprovement: string;
};

const proficiencyRank: Record<string, number> = {
  Exploring: 0,
  Growing: 1,
  Confident: 2,
  Advanced: 3,
};

function normalizeSkillName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function compareSkills(
  profileSkills: ProfileSkill[],
  radarSkills: RadarSkill[],
): SkillComparison[] {
  const namedProfileSkills = profileSkills.filter((skill) => skill.name.trim());

  return radarSkills.map((radarSkill) => {
    const normalizedRadarName = normalizeSkillName(radarSkill.name);
    const matchingSkills = namedProfileSkills.filter(
      (skill) => normalizeSkillName(skill.name) === normalizedRadarName,
    );

    const profileSkill = matchingSkills.reduce<ProfileSkill | undefined>(
      (bestMatch, candidate) => {
        if (!bestMatch) return candidate;

        const bestRank = proficiencyRank[bestMatch.level] ?? -1;
        const candidateRank = proficiencyRank[candidate.level] ?? -1;
        return candidateRank > bestRank ? candidate : bestMatch;
      },
      undefined,
    );

    const proficiency = profileSkill?.level.trim() || 'Not provided';
    const rank = proficiencyRank[proficiency];
    const needsImprovement =
      rank === undefined
        ? 'Not assessed'
        : rank < proficiencyRank.Confident
          ? 'Yes — practice may help'
          : 'No — not flagged by this rule';

    return {
      radarSkill,
      profileSkill,
      hasProfileSkill: Boolean(profileSkill),
      proficiency,
      needsImprovement,
    };
  });
}
