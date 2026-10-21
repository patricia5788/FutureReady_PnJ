import { ArrowRight, BookOpenCheck, BriefcaseBusiness, CheckCircle2, Globe2, UserRound } from 'lucide-react';
import { Link } from 'wouter';
import { careers, findCareer } from '@/data/career-catalog';
import { reportSignals } from '@/data/trend-signals';
import { analyzeCareer, rankCareerMatches } from '@/lib/career-matching';
import { buildRoadmap, loadRoadmapProgress } from '@/lib/learning-roadmap';
import type { Profile } from '@/lib/profile';
import { InfoNote, PageHeader, SourceLink } from '@/components/app-shell';

export function HomePage({ profile }: { profile: Profile }) {
  const hasSkills = profile.skills.length > 0;
  const ranked = hasSkills ? rankCareerMatches(profile, careers) : [];
  const targetCareer = findCareer(profile.targetCareer);
  const focusCareer = targetCareer ?? ranked[0]?.career;
  const focusMatch = focusCareer ? analyzeCareer(profile, focusCareer) : undefined;
  const roadmap = focusCareer && hasSkills ? buildRoadmap(profile, focusCareer) : undefined;
  const progress = loadRoadmapProgress();
  const completedSteps = roadmap?.steps.filter((step) => progress[step.id] === 'Completed').length ?? 0;
  const completedProfileSections = [
    Boolean(profile.education.trim()),
    Boolean(profile.experience.trim()),
    hasSkills,
    Boolean(profile.interests.trim()),
    Boolean(profile.goals.trim()),
    Boolean(profile.targetCareer),
  ].filter(Boolean).length;
  const trend = reportSignals[0];

  return (
    <main className="page-content">
      <PageHeader
        eyebrow="Your IT career exploration workspace"
        title={<>Connect your skills<br/><span className="text-[hsl(var(--primary))]">to a next step.</span></>}
        description="Compare your current skills with five IT pathways, then make a learning plan you can adjust."
        action={<Link href="/skills" className="button-primary" data-testid="button-home-profile">{hasSkills ? 'Edit my profile' : 'Create my profile'} <ArrowRight size={15}/></Link>}
      />

      <InfoNote className="mb-6" data-testid="notice-home-synthetic">
        <strong>Use as a guide, not a prediction.</strong> Profile scores are calculated from skills you entered. Career requirements and trend examples have sources; they do not predict hiring outcomes.
      </InfoNote>

      <div className="grid-main">
        <section className="card card-feature overflow-hidden relative">
          <div className="eyebrow !text-[hsl(var(--secondary))]">Profile completion</div>
          <h2 className="text-[30px] leading-[1.08] mt-3 mb-3 max-w-[470px]">
            {hasSkills ? `${completedProfileSections} of 6 profile sections filled` : 'No saved profile yet'}
          </h2>
          <p className="text-[13px] leading-relaxed opacity-80 max-w-[490px] mb-7">
            {hasSkills
              ? 'Your profile is saved in this browser. Update it any time to recalculate your role matches and learning pathway.'
              : 'Add a few skills and choose a target career before personalized matches or a roadmap appear.'}
          </p>
          <Link href="/skills" className="button-secondary !bg-[hsl(var(--secondary))] !border-transparent !text-[hsl(var(--primary))]" data-testid="button-home-complete-profile">
            {hasSkills ? 'Review my profile' : 'Start my profile'} <ArrowRight size={15}/>
          </Link>
          <UserRound className="absolute right-7 bottom-7 opacity-20" size={92} strokeWidth={1}/>
        </section>

        <section className="card">
          <div className="flex justify-between items-start">
            <div><div className="eyebrow">Career snapshot</div><h2 className="text-[22px] mt-2 mb-1">Your current signals</h2></div>
            <span className="badge" data-testid="status-profile">{hasSkills ? 'Profile-based' : 'Waiting for profile'}</span>
          </div>
          {hasSkills && focusMatch ? (
            <div className="mt-5">
              <div className="text-[13px] font-bold" data-testid="home-target-career">{focusCareer?.name ?? 'Suggested career'}</div>
              <div className="text-[12px] text-[hsl(var(--muted-foreground))] mt-1" data-testid="home-career-score">
                {focusMatch.score === null ? 'Add a role-related skill to calculate an alignment score.' : `${focusMatch.score}% alignment across ${focusMatch.assessedCount} assessed skills`}
              </div>
              <div className="border-t border-[hsl(var(--border))] mt-4 pt-4 text-[12px]">
                {focusCareer?.id === profile.targetCareer ? 'Selected learning target' : 'Highest current alignment; choose a target on Career Matches'}
              </div>
            </div>
          ) : (
            <p className="text-[13px] text-[hsl(var(--muted-foreground))] leading-relaxed mt-5" data-testid="home-no-personal-results">
              No personalized scores or skill gaps are shown until you enter skills and save your profile.
            </p>
          )}
          <Link href="/careers" className="text-[hsl(var(--primary))] text-[12px] font-bold no-underline mt-5 inline-flex items-center gap-2" data-testid="link-home-careers">
            See career matches <ArrowRight size={14}/>
          </Link>
        </section>
      </div>

      <div className="grid-main mt-5">
        <section className="card">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-lg bg-[hsl(var(--secondary)/.38)] text-[hsl(var(--primary))] grid place-items-center"><BriefcaseBusiness size={18}/></span>
            <div><div className="eyebrow">Your learning plan</div><h2 className="text-[20px] mt-1 mb-0">One role, practical steps</h2></div>
          </div>
          {hasSkills && profile.targetCareer && roadmap ? (
            <p className="text-[13px] leading-relaxed text-[hsl(var(--muted-foreground))]" data-testid="home-roadmap-progress">
              {targetCareer?.name}: {completedSteps} of {roadmap.steps.length} sourced learning steps completed. Skills not listed in your profile remain unassessed.
            </p>
          ) : (
            <p className="text-[13px] leading-relaxed text-[hsl(var(--muted-foreground))]" data-testid="home-roadmap-empty">
              Save a skills profile and choose a target career to build a pathway from its listed requirements.
            </p>
          )}
          <Link href="/roadmap" className="text-[hsl(var(--primary))] text-[12px] font-bold no-underline" data-testid="link-home-roadmap">Open My Learning Roadmap <ArrowRight className="inline" size={14}/></Link>
        </section>

        <section className="card">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-lg bg-[hsl(var(--secondary)/.38)] text-[hsl(var(--primary))] grid place-items-center"><Globe2 size={18}/></span>
            <div><div className="eyebrow">A sourced signal</div><h2 className="text-[20px] mt-1 mb-0">Technology skills outlook</h2></div>
          </div>
          <p className="text-[13px] leading-relaxed text-[hsl(var(--muted-foreground))]">{trend.headline} It is a global employer forecast, not current Malaysian hiring data.</p>
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] mb-3">World Economic Forum · published {trend.publicationDate}</div>
          <div className="flex flex-wrap gap-3">
            <SourceLink href={trend.sourceUrl}>Read the source report</SourceLink>
            <Link href="/trends" className="text-[hsl(var(--primary))] font-bold no-underline" data-testid="link-home-trends">Trends & scenarios <ArrowRight className="inline" size={13}/></Link>
          </div>
        </section>
      </div>

      <section className="card mt-5">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <div className="eyebrow">Your profile is the input</div>
            <h2 className="text-[21px] mt-1 mb-1">See how the example scores are made</h2>
            <p className="text-[12px] text-[hsl(var(--muted-foreground))] m-0">Only provided, name-matched skills are assessed. Not-provided skills are not counted as zero.</p>
          </div>
          <Link href="/careers" className="button-secondary" data-testid="button-home-matches">Explore all five roles <ArrowRight size={14}/></Link>
        </div>
        <div className="grid-main mt-4">
          {hasSkills ? ranked.slice(0, 3).map((match) => (
            <article className="stat-tile" key={match.career.id} data-testid={`home-match-${match.career.id}`}>
              <div className="stat-value text-[20px]">{match.score === null ? '—' : `${match.score}%`}</div>
              <div className="stat-label">{match.career.name}</div>
              <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-2">{match.assessedCount}/{match.totalRequirements} requirements assessed</div>
            </article>
          )) : (
            <div className="text-[12px] text-[hsl(var(--muted-foreground))] flex items-center gap-2"><BookOpenCheck size={16}/> Personalized match indicators will appear after you save skills.</div>
          )}
        </div>
        {hasSkills && focusCareer && focusMatch?.developing.length ? (
          <div className="mt-5 border-t border-[hsl(var(--border))] pt-4" data-testid="home-key-gaps">
            <div className="eyebrow">Known skill opportunities for {focusCareer.name}</div>
            <div className="flex flex-wrap gap-2 mt-2">{focusMatch.developing.map((item) => <span className="badge" key={item.requirement.id}>{item.requirement.name} · {item.profileSkill?.level}</span>)}</div>
            <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-2">Other role skills not listed in the profile are unassessed, not assumed absent.</p>
          </div>
        ) : null}
        {hasSkills && focusCareer ? (
          <Link href="/sdg-mapping" className="text-[hsl(var(--primary))] text-[12px] font-bold no-underline mt-5 inline-flex items-center gap-2" data-testid="link-home-sdg">
            <CheckCircle2 size={14}/> View potential SDG links for {focusCareer.name}
          </Link>
        ) : null}
      </section>
    </main>
  );
}

