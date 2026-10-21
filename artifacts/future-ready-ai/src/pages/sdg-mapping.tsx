import { useMemo, useState } from 'react';
import { ArrowRight, Globe2 } from 'lucide-react';
import { Link } from 'wouter';
import { careers } from '@/data/career-catalog';
import { sdgMappings } from '@/data/sdg-mappings';
import { buildRoadmap } from '@/lib/learning-roadmap';
import type { Profile } from '@/lib/profile';
import { InfoNote, PageHeader, SourceLink } from '@/components/app-shell';

const sdgOptions = [
  { number: 4, name: 'Quality Education' },
  { number: 8, name: 'Decent Work and Economic Growth' },
  { number: 9, name: 'Industry, Innovation and Infrastructure' },
];

export function SdgMappingPage({ profile }: { profile: Profile }) {
  const [careerFilter, setCareerFilter] = useState(profile.targetCareer || 'all');
  const [goalFilter, setGoalFilter] = useState('all');
  const selectedCareer = careers.find((career) => career.id === profile.targetCareer);
  const roadmap = selectedCareer && profile.skills.length ? buildRoadmap(profile, selectedCareer) : undefined;
  const roadmapSkillNames = new Set(
    roadmap?.steps.flatMap((step) => step.skills.map((item) => item.requirement.name)) ?? [],
  );

  const results = useMemo(() => sdgMappings.filter((mapping) => {
    const careerMatches = careerFilter === 'all' || mapping.careerId === careerFilter;
    const goalMatches = goalFilter === 'all' || mapping.goalNumber === Number(goalFilter);
    return careerMatches && goalMatches;
  }), [careerFilter, goalFilter]);

  return (
    <main className="page-content">
      <PageHeader
        eyebrow="Potential connections to UN goals"
        title="SDG Mapping"
        description="Explore how skills in each IT career pathway might support selected Sustainable Development Goals."
      />
      <InfoNote className="mb-5" data-testid="notice-sdg-limitation">
        <strong>Not an official UN endorsement.</strong> Goal names and numbers link to the UN's pages. The career-to-goal explanations are team-defined potential connections; they do not show or guarantee measurable impact.
      </InfoNote>

      <section className="card mb-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="field !mb-0">
            <label htmlFor="sdg-career-filter">Filter by career</label>
            <select id="sdg-career-filter" value={careerFilter} onChange={(event) => setCareerFilter(event.target.value)} data-testid="select-sdg-career">
              <option value="all">All five careers</option>
              {careers.map((career) => <option value={career.id} key={career.id}>{career.name}</option>)}
            </select>
          </div>
          <div className="field !mb-0">
            <label htmlFor="sdg-goal-filter">Filter by SDG</label>
            <select id="sdg-goal-filter" value={goalFilter} onChange={(event) => setGoalFilter(event.target.value)} data-testid="select-sdg-goal">
              <option value="all">All mapped goals</option>
              {sdgOptions.map((goal) => <option value={goal.number} key={goal.number}>Goal {goal.number} · {goal.name}</option>)}
            </select>
          </div>
        </div>
      </section>

      {results.length ? (
        <div className="grid-main">
          {results.map((mapping) => {
            const career = careers.find((item) => item.id === mapping.careerId);
            const relatedRoadmapSkills = mapping.relatedSkills.filter((name) => roadmapSkillNames.has(name));
            return (
              <article className="card" key={`${mapping.careerId}-${mapping.goalNumber}`} data-testid={`sdg-card-${mapping.careerId}-${mapping.goalNumber}`}>
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))] grid place-items-center"><Globe2 size={20}/></span>
                  <div>
                    <div className="eyebrow">{career?.name}</div>
                    <h2 className="text-[20px] mt-1 mb-1">SDG {mapping.goalNumber}: {mapping.goalName}</h2>
                  </div>
                </div>
                <p className="text-[12px] leading-relaxed text-[hsl(var(--muted-foreground))] mt-4">{mapping.explanation}</p>
                <div className="eyebrow mb-2">Related pathway skills · team-defined</div>
                <div className="flex flex-wrap gap-2">
                  {mapping.relatedSkills.map((skill) => <span className="badge" key={skill}>{skill}</span>)}
                </div>
                <div className="rounded-lg bg-[hsl(var(--muted))] p-3 mt-4 text-[11px] leading-relaxed" data-testid={`sdg-limitation-${mapping.careerId}-${mapping.goalNumber}`}>
                  {mapping.limitation}
                </div>
                <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-4">
                  Source for the official goal definition: <SourceLink href={mapping.sourceUrl}>{mapping.sourceName}</SourceLink>
                </div>
                {profile.targetCareer === mapping.careerId && (
                  <div className="border-t border-[hsl(var(--border))] mt-4 pt-3" data-testid={`sdg-roadmap-skills-${mapping.careerId}-${mapping.goalNumber}`}>
                    <div className="eyebrow">Skills in your current learning roadmap</div>
                    {relatedRoadmapSkills.length ? (
                      <div className="flex flex-wrap gap-2 mt-2">{relatedRoadmapSkills.map((name) => <span className="badge" key={name}>{name}</span>)}</div>
                    ) : (
                      <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-2 mb-0">No listed roadmap step currently maps to these related skills.</p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <section className="card" data-testid="sdg-empty-results">
          <h2 className="text-[20px]">No mappings match these filters.</h2>
          <button className="button-secondary" onClick={() => { setCareerFilter('all'); setGoalFilter('all'); }}>Show all mappings</button>
        </section>
      )}

      <section className="card mt-5">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div><div className="eyebrow">Career-specific connections</div><h2 className="text-[20px] mt-1 mb-0">Select a target career to connect roadmap skills.</h2></div>
          <Link href="/careers" className="button-secondary" data-testid="link-sdg-careers">Review career matches <ArrowRight size={14}/></Link>
        </div>
        {selectedCareer && <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-3 mb-0" data-testid="sdg-selected-career">Current target: {selectedCareer.name}. Related roadmap skills are highlighted on its mappings when the same skill appears in a learning step.</p>}
      </section>
    </main>
  );
}

