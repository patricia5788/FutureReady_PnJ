import { useState } from 'react';
import { ArrowRight, BookOpenCheck, Check, Clock3, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';
import { findCareer } from '@/data/career-catalog';
import {
  buildRoadmap,
  loadRoadmapProgress,
  saveRoadmapProgress,
  type RoadmapProgress,
  type RoadmapStatus,
} from '@/lib/learning-roadmap';
import type { Profile } from '@/lib/profile';
import { EmptyProfileCard, InfoNote, PageHeader, SourceLink } from '@/components/app-shell';

const statusOptions: RoadmapStatus[] = ['Not started', 'In progress', 'Completed'];

export function LearningRoadmapPage({ profile }: { profile: Profile }) {
  const [progress, setProgress] = useState<RoadmapProgress>(loadRoadmapProgress);
  const career = findCareer(profile.targetCareer);
  const hasSkills = profile.skills.length > 0;
  const roadmap = career && hasSkills ? buildRoadmap(profile, career) : undefined;
  const completed = roadmap?.steps.filter((step) => progress[step.id] === 'Completed').length ?? 0;

  const updateStatus = (stepId: string, status: RoadmapStatus) => {
    setProgress((current) => {
      const next = { ...current, [stepId]: status };
      saveRoadmapProgress(next);
      return next;
    });
  };

  return (
    <main className="page-content">
      <PageHeader
        eyebrow="Ordered steps for your selected role"
        title="My Learning Roadmap"
        description="The steps come from your target career's listed requirements and skills in your saved profile."
      />
      <InfoNote className="mb-5" data-testid="notice-roadmap-data">
        <strong>Check before you commit.</strong> Course cost and duration labels show what the linked page or supplied course list stated when checked. “Not verified” means we could not confirm it. A course is a starting resource, not proof of role readiness.
      </InfoNote>

      {!hasSkills || !career ? (
        <EmptyProfileCard>
          <div className="eyebrow">A target and profile are needed first</div>
          <h2 className="text-[24px] mt-2">{!hasSkills ? 'Add skills to build your pathway.' : 'Choose a target career to build your pathway.'}</h2>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] leading-relaxed">
            Skills that are not listed are unassessed. The roadmap will show sourced starting resources for the selected role and identify any requirements without a verified resource in this catalog.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Link href="/skills" className="button-primary" data-testid="button-roadmap-profile">Complete my profile <ArrowRight size={14}/></Link>
            <Link href="/careers" className="button-secondary" data-testid="button-roadmap-careers">Choose a career <ArrowRight size={14}/></Link>
          </div>
        </EmptyProfileCard>
      ) : (
        <>
          <section className="card mb-5" data-testid="roadmap-summary">
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div>
                <div className="eyebrow">Selected target</div>
                <h2 className="text-[23px] mt-2 mb-1">{career.name}</h2>
                <p className="text-[12px] text-[hsl(var(--muted-foreground))] m-0">Sourced opportunities are ordered from assessed lower-level skills to skills not yet listed.</p>
              </div>
              <span className="badge" data-testid="roadmap-progress">{completed} of {roadmap.steps.length} steps completed</span>
            </div>
            <Link href="/careers" className="text-[hsl(var(--primary))] text-[12px] font-bold no-underline mt-4 inline-flex items-center gap-2" data-testid="link-roadmap-career-change">Change target career <ArrowRight size={14}/></Link>
          </section>

          {roadmap.steps.length > 0 ? (
            <section className="flex flex-col gap-3" aria-label="Personalized learning steps">
              {roadmap.steps.map((step, index) => (
                <article className="card" key={step.id} data-testid={`roadmap-step-${step.id}`}>
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div className="flex gap-3">
                      <span className="w-9 h-9 rounded-full bg-[hsl(var(--secondary)/.5)] text-[hsl(var(--primary))] grid place-items-center font-bold text-[12px]">{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <div className="eyebrow">Learning step</div>
                        <h2 className="text-[20px] mt-1 mb-1">{step.resource.name}</h2>
                        <p className="text-[11px] text-[hsl(var(--muted-foreground))] m-0">{step.resource.provider}</p>
                      </div>
                    </div>
                    <label className="field !mb-0 min-w-[150px]">
                      <span className="sr-only">Progress for {step.resource.name}</span>
                      <select value={progress[step.id] ?? 'Not started'} onChange={(event) => updateStatus(step.id, event.target.value as RoadmapStatus)} data-testid={`roadmap-status-${step.id}`}>
                        {statusOptions.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className="mt-4">
                    <div className="eyebrow mb-2">Skills this resource supports</div>
                    <div className="flex flex-wrap gap-2">
                      {step.skills.map((item) => (
                        <span className="badge" key={item.requirement.id} data-testid={`roadmap-skill-${step.id}-${item.requirement.id}`}>
                          {item.requirement.name}: {item.status === 'developing' ? `${item.profileSkill?.level} → ${item.requirement.requiredLevel === 3 ? 'Advanced' : 'Intermediate'}` : 'Not provided — check first'}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[12px] leading-relaxed text-[hsl(var(--muted-foreground))] mt-4 mb-3">{step.resource.reason}</p>
                  <div className="grid sm:grid-cols-3 gap-2 text-[11px] mb-4">
                    <div className="comparison-fact"><div className="comparison-fact-label">Cost</div><div className="comparison-fact-value">{step.resource.cost}</div></div>
                    <div className="comparison-fact"><div className="comparison-fact-label">Estimated duration</div><div className="comparison-fact-value flex items-center gap-1"><Clock3 size={12}/>{step.resource.duration}</div></div>
                    <div className="comparison-fact"><div className="comparison-fact-label">Checked</div><div className="comparison-fact-value">{step.resource.checkedDate}</div></div>
                  </div>
                  {step.resource.accessNote && <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0 mb-3">{step.resource.accessNote}</p>}
                  <SourceLink href={step.resource.url}>{step.resource.name} <ExternalLink className="inline" size={12}/></SourceLink>
                </article>
              ))}
            </section>
          ) : (
            <section className="card" data-testid="roadmap-no-steps">
              <BookOpenCheck size={22} className="text-[hsl(var(--primary))]"/>
              <h2 className="text-[20px] mt-2">No sourced learning steps are needed for the listed requirements.</h2>
              <p className="text-[12px] text-[hsl(var(--muted-foreground))]">All assessed requirements currently meet the catalog's target levels. Unlisted skills remain unassessed.</p>
            </section>
          )}

          {roadmap.needsResource.length > 0 && (
            <section className="card card-muted mt-5" data-testid="roadmap-unmapped-gaps">
              <div className="eyebrow">Needs a resource check</div>
              <h2 className="text-[20px] mt-2">These requirements do not yet have a verified course in the catalog.</h2>
              <p className="text-[12px] text-[hsl(var(--muted-foreground))]">This app does not invent a course link or estimate. Check the role source and select a suitable resource before adding a step.</p>
              <div className="flex flex-wrap gap-2 mt-3">{roadmap.needsResource.map((item) => <span className="badge" key={item.requirement.id}>{item.requirement.name} · {item.status === 'developing' ? 'below target' : 'not provided'}</span>)}</div>
            </section>
          )}

          <section className="card mt-5 flex flex-wrap justify-between items-center gap-3">
            <div><div className="eyebrow">Potential links, not guarantees</div><h2 className="text-[19px] mt-1 mb-0">See how this pathway can connect with the SDGs.</h2></div>
            <Link href="/sdg-mapping" className="button-secondary" data-testid="link-roadmap-sdg">Open SDG Mapping <ArrowRight size={14}/></Link>
          </section>
        </>
      )}
    </main>
  );
}

