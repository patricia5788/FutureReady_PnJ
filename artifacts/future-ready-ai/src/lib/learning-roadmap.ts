import type { Career } from '@/data/career-catalog';
import { learningResources, type LearningResource } from '@/data/learning-resources';
import { analyzeCareer, type RequirementAssessment } from '@/lib/career-matching';
import type { Profile } from '@/lib/profile';

export type RoadmapStatus = 'Not started' | 'In progress' | 'Completed';
export type RoadmapProgress = Record<string, RoadmapStatus>;

export type RoadmapStep = {
  id: string;
  resource: LearningResource;
  skills: RequirementAssessment[];
  priority: number;
};

export type Roadmap = {
  steps: RoadmapStep[];
  needsResource: RequirementAssessment[];
};

export function buildRoadmap(profile: Profile, career: Career): Roadmap {
  const match = analyzeCareer(profile, career);
  const opportunities = [...match.developing, ...match.unprovided];
  const grouped = new Map<string, RoadmapStep>();
  const needsResource: RequirementAssessment[] = [];

  opportunities.forEach((assessment, order) => {
    const resource = learningResources.find(
      (item) =>
        item.careerIds.includes(career.id) &&
        item.skillIds.includes(assessment.requirement.id),
    );

    if (!resource) {
      needsResource.push(assessment);
      return;
    }

    const existing = grouped.get(resource.id);
    if (existing) {
      existing.skills.push(assessment);
      existing.priority = Math.min(existing.priority, order);
    } else {
      grouped.set(resource.id, {
        id: `${career.id}-${resource.id}`,
        resource,
        skills: [assessment],
        priority: order,
      });
    }
  });

  return {
    steps: [...grouped.values()].sort((left, right) => left.priority - right.priority),
    needsResource,
  };
}

const progressKey = 'future-ready-roadmap-progress';

export function loadRoadmapProgress(): RoadmapProgress {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(progressKey) || '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, RoadmapStatus] =>
        ['Not started', 'In progress', 'Completed'].includes(String(entry[1])),
      ),
    );
  } catch {
    return {};
  }
}

export function saveRoadmapProgress(progress: RoadmapProgress): void {
  try {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  } catch {
    // Progress remains in the current app session if browser storage is disabled.
  }
}

