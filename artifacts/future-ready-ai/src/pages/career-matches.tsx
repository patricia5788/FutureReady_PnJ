import { ArrowRight, CheckCircle2, CircleHelp, Target } from 'lucide-react';
import { Link } from 'wouter';
import { careers } from '@/data/career-catalog';
import { analyzeCareer, rankCareerMatches, type RequirementAssessment } from '@/lib/career-matching';
import type { Profile } from '@/lib/profile';
import { EmptyProfileCard, InfoNote, PageHeader, SourceLink } from '@/components/app-shell';

function assessmentText(item: RequirementAssessment): string {
  if (item.status === 'met') return `${item.profileSkill?.level} · target ${item.requirement.requiredLevel === 3 ? 'Advanced' : 'Intermediate'}`;
  if (item.status === 'developing') return `${item.profileSkill?.level} · target ${item.requirement.requiredLevel === 3 ? 'Advanced' : 'Intermediate'}`;
  return 'Not provided — unassessed';
}

function assessmentColor(item: RequirementAssessment): string {
  if (item.status === 'met') return 'text-[hsl(var(--primary))]';
  if (item.status === 'developing') return 'text-amber-700';
  return 'text-[hsl(var(--muted-foreground))]';
}

export function CareerMatchesPage({ profile, onSave }: { profile: Profile; onSave: (profile: Profile) => void }) {
  const hasSkills = profile.skills.length > 0;
  const ranked = hasSkills ? rankCareerMatches(profile, careers) : [];

  return (
    <main className="page-content">
      <PageHeader
        eyebrow="Five sourced IT pathways"
        title="Career Matches"
        description="See which listed requirements match skills in your profile, which need more practice, and which have not been assessed."
      />
      <InfoNote className="mb-5" data-testid="notice-career-score">
        <strong>Explainable alignment, not job probability.</strong> Scores average only listed, name-matched skills. Skills not in your profile are excluded—not treated as zero. Level mapping: Beginner = 1, Intermediate = 2, Advanced = 3.
      </InfoNote>

      <section className="card card-muted mb-5" data-testid="career-score-formula">
        <div className="flex items-start gap-3">
          <CircleHelp size={18} className="text-[hsl(var(--primary))] mt-1"/>
          <div>
            <div className="eyebrow">How the score is calculated</div>
            <p className="text-[12px] leading-relaxed mb-1 mt-2">
              For every requirement that matches a provided profile skill, points are <code>min(user level ÷ required level, 1) × 100</code>. The career score is the average of those assessed points. A missing skill is shown as “Not provided” and does not enter the average. With no matched skills, no score is shown.
            </p>
            <p className="text-[11px] text-[hsl(var(--muted-foreground))] m-0">
              Common spelling and short-form aliases are explicit in the matching code; other synonyms are not guessed. If a skill is listed more than once, its highest entered level is used.
            </p>
          </div>
        </div>
      </section>

      {!hasSkills ? (
        <EmptyProfileCard>
          <div className="eyebrow">No personalized results yet</div>
          <h2 className="text-[24px] mt-2">Add IT skills to calculate career alignment.</h2>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] leading-relaxed">
            The five role catalogs remain available, but we do not show personalized scores or gaps until you save skills.
          </p>
          <Link href="/skills" className="button-primary mt-2" data-testid="button-careers-complete-profile">Create or edit my profile <ArrowRight size={14}/></Link>
        </EmptyProfileCard>
      ) : (
        <div className="flex flex-col gap-4">
          {ranked.map((match) => (
            <article className="card" key={match.career.id} data-testid={`career-card-${match.career.id}`}>
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <div className="eyebrow">Candidate career · sourced requirements</div>
                  <h2 className="text-[24px] mt-2 mb-1">{match.career.name}</h2>
                  <p className="text-[12px] text-[hsl(var(--muted-foreground))] m-0 max-w-[760px]">{match.career.description}</p>
                </div>
                <div className="text-right">
                  <div className="badge" data-testid={`career-score-${match.career.id}`}>
                    {match.score === null ? 'Not enough profile data' : `${match.score}% skill alignment`}
                  </div>
                  <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-2" data-testid={`career-coverage-${match.career.id}`}>
                    {match.assessedCount} of {match.totalRequirements} requirements assessed
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-4 mb-3">
                Reference: <SourceLink href={match.career.sourceUrl}>{match.career.sourceName}</SourceLink>. {match.career.sourceNote}
              </p>

              <div className="grid sm:grid-cols-3 gap-3 mb-4">
                <div className="stat-tile">
                  <div className="stat-value text-[18px]">{match.met.length}</div>
                  <div className="stat-label">Requirements at or above target</div>
                </div>
                <div className="stat-tile">
                  <div className="stat-value text-[18px]">{match.developing.length}</div>
                  <div className="stat-label">Provided skills below target</div>
                </div>
                <div className="stat-tile">
                  <div className="stat-value text-[18px]">{match.unprovided.length}</div>
                  <div className="stat-label">Not provided · unassessed</div>
                </div>
              </div>

              <details className="border-t border-[hsl(var(--border))] pt-3" open>
                <summary className="cursor-pointer text-[12px] font-bold flex items-center gap-2" data-testid={`career-evidence-toggle-${match.career.id}`}>
                  <CheckCircle2 size={14}/> View requirements, profile matches, and sources
                </summary>
                <div className="mt-3 flex flex-col gap-2">
                  {match.assessments.map((item) => (
                    <div className="skill-evidence-row" key={item.requirement.id} data-testid={`career-skill-${match.career.id}-${item.requirement.id}`}>
                      <div className="min-w-0">
                        <div className="text-[12px] font-bold">{item.requirement.name} <span className="text-[10px] font-normal text-[hsl(var(--muted-foreground))]">· target {item.requirement.requiredLevel === 3 ? 'Advanced' : 'Intermediate'}</span></div>
                        <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">{item.requirement.description} {item.requirement.reason}</div>
                      </div>
                      <div className={`text-[11px] font-bold ${assessmentColor(item)}`} data-testid={`career-skill-status-${match.career.id}-${item.requirement.id}`}>
                        {assessmentText(item)}
                      </div>
                      <SourceLink href={item.requirement.sourceUrl}>{item.requirement.sourceName}</SourceLink>
                    </div>
                  ))}
                </div>
              </details>

              <div className="flex flex-wrap items-center gap-2 mt-5">
                <button
                  type="button"
                  className={profile.targetCareer === match.career.id ? 'button-primary' : 'button-secondary'}
                  aria-pressed={profile.targetCareer === match.career.id}
                  onClick={() => onSave({ ...profile, targetCareer: match.career.id })}
                  data-testid={`button-target-${match.career.id}`}
                >
                  <Target size={14}/>{profile.targetCareer === match.career.id ? 'Selected learning target' : 'Set as learning target'}
                </button>
                {profile.targetCareer === match.career.id && (
                  <Link href="/roadmap" className="button-secondary" data-testid="link-career-roadmap">Open this learning roadmap <ArrowRight size={14}/></Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

