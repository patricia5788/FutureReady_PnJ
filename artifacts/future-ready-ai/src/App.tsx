import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';
import { ErrorBoundary } from '@/components/error-boundary';
import { Form } from '@/components/ui/form';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { compareSkills } from '@/lib/skill-comparison';
import NotFound from '@/pages/not-found';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  ArrowRight, Bookmark, BriefcaseBusiness, Check, ChevronRight, Compass,
  Lightbulb, Plus, Radar, Route as RouteIcon, Sparkles,
  Trash2, UserRound, type LucideIcon,
} from 'lucide-react';

type Skill = { name: string; level: string; experience: string };
type Profile = { skills: Skill[]; experience: string; interests: string; goals: string };

const initialProfile: Profile = {
  skills: [
    { name: 'Research & synthesis', level: 'Confident', experience: '2–4 years' },
    { name: 'Writing', level: 'Growing', experience: '1–2 years' },
    { name: 'Spreadsheets', level: 'Confident', experience: '2–4 years' },
  ],
  experience: 'Early career',
  interests: 'Making complex ideas easier to understand, responsible technology, community projects',
  goals: 'Explore roles that combine communication, research, and practical AI tools.',
};

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/', label: 'Home overview', icon: Compass },
  { href: '/skills', label: 'My Skills Profile', icon: UserRound },
  { href: '/radar', label: 'Future Skills Radar', icon: Radar },
  { href: '/comparison', label: 'Profile comparison', icon: Check },
  { href: '/careers', label: 'Career Matches', icon: BriefcaseBusiness },
  { href: '/roadmap', label: 'My Learning Roadmap', icon: RouteIcon },
  { href: '/scenarios', label: 'AI Scenario Comparison', icon: Lightbulb },
];

const queryClient = new QueryClient();

function loadProfile(): Profile {
  try {
    const saved = localStorage.getItem('future-ready-profile');
    if (saved) return { ...initialProfile, ...JSON.parse(saved) };
  } catch { /* Keep the sensible sample profile if storage is unavailable. */ }
  return initialProfile;
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [profile] = useState(loadProfile);
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="flex items-center gap-3 px-2 mb-10 no-underline text-inherit" data-testid="link-brand">
          <span className="brand-mark">F</span>
          <span className="leading-tight">
            <strong className="block text-[14px] tracking-tight">FutureReady</strong>
            <span className="text-[10px] opacity-60">AI · career compass</span>
          </span>
        </Link>
        <p className="px-3 mb-2 text-[9px] uppercase tracking-[.16em] opacity-50 font-bold">Explore your next</p>
        <nav aria-label="Main navigation" className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="nav-link" aria-current={location === href ? 'page' : undefined} data-testid={`link-nav-${href === '/' ? 'home' : href.slice(1)}`}>
              <Icon size={16} strokeWidth={1.8} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-white/10 bg-white/[.04] p-4">
          <div className="text-[10px] uppercase tracking-[.14em] text-white/50 mb-2">A note on the future</div>
          <p className="text-[12px] leading-relaxed text-white/80 m-0">Possibilities, not predictions. Use these examples as a starting point for your own thinking.</p>
        </div>
      </aside>
      <div className="main-area">
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="nav-link" aria-current={location === href ? 'page' : undefined} data-testid={`mobile-link-${href === '/' ? 'home' : href.slice(1)}`}>
              <Icon size={15} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <header className="topbar">
          <div className="text-[12px] font-semibold text-[hsl(var(--muted-foreground))]">A clearer view of what could be next</div>
          <Link href="/skills" className="flex items-center gap-2 no-underline text-[hsl(var(--foreground))] text-[12px] font-bold" data-testid="link-profile-shortcut">
            <span className="w-8 h-8 rounded-full bg-[hsl(var(--secondary))] grid place-items-center text-[hsl(var(--primary))]"><UserRound size={15}/></span>
            Your profile <ChevronRight size={14}/>
          </Link>
        </header>
        {children}
      </div>
      <span className="sr-only" data-testid="profile-skill-count">{profile.skills.length} skills in profile</span>
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: ReactNode; description: string; action?: ReactNode }) {
  return <div className="flex flex-wrap justify-between items-end gap-5 mb-8">
    <div><div className="eyebrow">{eyebrow}</div><h1 className="page-title">{title}</h1><p className="lede">{description}</p></div>
    {action}
  </div>;
}

function SyntheticNote() {
  return <div className="synthetic-note mt-5" data-testid="notice-synthetic"><strong>Illustrative examples.</strong> All demand signals, scores, roles, learning times, and scenarios on this page are synthetic—not verified real-world facts or forecasts.</div>;
}

function HomePage({ profile }: { profile: Profile }) {
  const skillsCount = profile.skills.filter((s) => s.name.trim()).length;
  return <main className="page-content">
    <PageHeader eyebrow="Your career exploration workspace" title={<>Make room for<br/><span className="text-[hsl(var(--primary))]">what comes next.</span></>} description="A practical place to connect what you already know with the kinds of work you might want to grow into." action={<Link href="/skills" className="button-primary" data-testid="button-home-edit-profile">Review my profile <ArrowRight size={15}/></Link>} />
    <div className="synthetic-note mb-6" data-testid="notice-home-synthetic"><strong>Explore, don’t predict.</strong> The examples here are synthetic and designed to help you ask better questions—not to claim certainty about the labor market.</div>
    <div className="grid-main">
      <section className="card card-feature overflow-hidden relative">
        <div className="eyebrow !text-[hsl(var(--secondary))]">A good place to begin</div>
        <h2 className="text-[30px] leading-[1.08] mt-3 mb-3 max-w-[470px]">Your skills are a starting point, not a box.</h2>
        <p className="text-[13px] leading-relaxed opacity-80 max-w-[490px] mb-7">Take a look at a few directions that bring your strengths together in new ways. Adjust your profile anytime; this is your exploration, not a test.</p>
        <Link href="/careers" className="button-secondary !bg-[hsl(var(--secondary))] !border-transparent !text-[hsl(var(--primary))]" data-testid="button-explore-matches">Explore career matches <ArrowRight size={15}/></Link>
        <Sparkles className="absolute right-7 bottom-7 opacity-20" size={98} strokeWidth={1}/>
      </section>
      <section className="card">
        <div className="flex justify-between items-start">
          <div><div className="eyebrow">Your snapshot</div><h2 className="text-[22px] mt-2 mb-1">A profile in progress</h2></div>
          <span className="badge" data-testid="status-profile">Ready to explore</span>
        </div>
        <div className="stat-grid mt-6">
          <div className="stat-tile"><div className="stat-value" data-testid="value-skills-count">{skillsCount}</div><div className="stat-label">skills listed</div></div>
          <div className="stat-tile"><div className="stat-value">3</div><div className="stat-label">paths to explore</div></div>
        </div>
        <div className="border-t border-[hsl(var(--border))] mt-6 pt-5 flex items-center justify-between text-[12px]">
          <span className="text-[hsl(var(--muted-foreground))]">Last step: describe what interests you</span>
          <Link href="/skills" className="text-[hsl(var(--primary))] font-bold no-underline" data-testid="link-complete-profile">Continue <ArrowRight className="inline" size={13}/></Link>
        </div>
      </section>
    </div>
    <div className="grid-main mt-5">
      <section className="card">
        <div className="flex items-center gap-3 mb-4"><span className="w-9 h-9 rounded-lg bg-[hsl(var(--secondary)/.38)] text-[hsl(var(--primary))] grid place-items-center"><Radar size={18}/></span><div><div className="eyebrow">A small signal to consider</div><h2 className="text-[20px] mt-1 mb-0">Skills that travel well</h2></div></div>
        <p className="text-[13px] leading-relaxed text-[hsl(var(--muted-foreground))]">Clear communication, critical thinking, and learning agility can complement technical tools across many kinds of work. Try the radar to compare sample skill themes.</p>
        <Link href="/radar" className="text-[hsl(var(--primary))] text-[12px] font-bold no-underline" data-testid="link-radar-home">Open the skills radar <ArrowRight className="inline" size={14}/></Link>
      </section>
      <section className="card">
        <div className="eyebrow">Your next step</div><h2 className="text-[22px] mt-2 mb-2">Turn curiosity into a plan.</h2>
        <p className="text-[13px] text-[hsl(var(--muted-foreground))] leading-relaxed mb-5">Choose one useful skill to practice this month. A small experiment can teach you more than a perfect prediction.</p>
        <Link href="/roadmap" className="button-secondary" data-testid="button-open-roadmap">See a sample roadmap <ArrowRight size={14}/></Link>
      </section>
    </div>
  </main>;
}

function SkillsPage({ profile, onSave }: { profile: Profile; onSave: (p: Profile) => void }) {
  const form = useForm<Profile>({ defaultValues: profile });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'skills' });
  const [saved, setSaved] = useState(false);
  const save = form.handleSubmit((values) => {
    const clean = { ...values, skills: values.skills.filter((skill) => skill.name.trim()) };
    onSave(clean);
    form.reset(clean);
    setSaved(true);
  });
  return <main className="page-content">
    <PageHeader eyebrow="Start with what you bring" title="My Skills Profile" description="A useful snapshot is honest, not exhaustive. Add the skills, experience, and interests that feel relevant to you."/>
    <div className="synthetic-note mb-5 max-w-[900px]" data-testid="notice-profile-sample"><strong>Sample profile.</strong> This starting information is synthetic. Replace it with your own before exploring.</div>
    <Form {...form}>
    <form onSubmit={save} className="max-w-[900px]">
      <section className="card mb-5">
        <div className="flex flex-wrap justify-between items-start gap-3 mb-5"><div><div className="eyebrow">01 / Skills</div><h2 className="text-[23px] mt-2 mb-1">What can you do today?</h2><p className="text-[12px] text-[hsl(var(--muted-foreground))] m-0">Choose your own level—there is no right answer.</p></div><button type="button" onClick={() => { append({ name: '', level: 'Exploring', experience: 'Just starting' }); setSaved(false); }} className="button-secondary" data-testid="button-add-skill"><Plus size={15}/> Add a skill</button></div>
        {fields.length === 0 && <div className="text-center py-8 px-4 rounded-xl border border-dashed border-[hsl(var(--border))]" data-testid="empty-skills"><p className="font-bold text-[14px]">Your skills list is ready for a first entry.</p><p className="text-[12px] text-[hsl(var(--muted-foreground))]">Add a skill you use at work, school, or in everyday life.</p><button type="button" className="button-secondary" onClick={() => { append({ name: '', level: 'Exploring', experience: 'Just starting' }); setSaved(false); }} data-testid="button-add-first-skill"><Plus size={14}/> Add first skill</button></div>}
        {fields.map((field, i) => <div className="skill-row" key={field.id} data-testid={`row-skill-${i}`}>
          <label className="sr-only" htmlFor={`skill-name-${i}`}>Skill name {i + 1}</label><input id={`skill-name-${i}`} aria-label={`Skill name ${i + 1}`} {...form.register(`skills.${i}.name`, { onChange: () => setSaved(false) })} placeholder="Skill name" data-testid={`input-skill-name-${i}`}/>
          <label className="sr-only" htmlFor={`skill-level-${i}`}>Proficiency level for {field.name || `skill ${i + 1}`}</label><select id={`skill-level-${i}`} {...form.register(`skills.${i}.level`, { onChange: () => setSaved(false) })} data-testid={`select-skill-level-${i}`}><option>Exploring</option><option>Growing</option><option>Confident</option><option>Advanced</option></select>
          <label className="sr-only" htmlFor={`skill-experience-${i}`}>Experience with {field.name || `skill ${i + 1}`}</label><select id={`skill-experience-${i}`} {...form.register(`skills.${i}.experience`, { onChange: () => setSaved(false) })} data-testid={`select-skill-experience-${i}`}><option>Just starting</option><option>Under 1 year</option><option>1–2 years</option><option>2–4 years</option><option>5+ years</option></select>
          <button type="button" onClick={() => { remove(i); setSaved(false); }} className="w-9 h-9 grid place-items-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]" aria-label={`Remove ${field.name || `skill ${i + 1}`}`} data-testid={`button-remove-skill-${i}`}><Trash2 size={15}/></button>
        </div>)}
      </section>
      <div className="grid-main">
        <section className="card">
          <div className="eyebrow">02 / Experience</div><h2 className="text-[22px] mt-2 mb-5">Where are you in your journey?</h2>
          <div className="field"><label htmlFor="experience">Current experience stage</label><select id="experience" {...form.register('experience', { onChange: () => setSaved(false) })} data-testid="select-experience"><option>Student</option><option>Fresh graduate</option><option>Early career</option><option>Mid-career</option><option>Exploring a career change</option><option>Other</option></select></div>
          <div className="field !mb-0"><label htmlFor="interests">Interests and topics you care about</label><textarea id="interests" {...form.register('interests', { onChange: () => setSaved(false) })} placeholder="What kinds of problems hold your attention?" data-testid="input-interests"/></div>
        </section>
        <section className="card">
          <div className="eyebrow">03 / Direction</div><h2 className="text-[22px] mt-2 mb-5">What would you like to explore?</h2>
          <div className="field"><label htmlFor="goals">Career goals or questions</label><textarea id="goals" {...form.register('goals', { onChange: () => setSaved(false) })} placeholder="A role, a question, or a possibility…" data-testid="input-career-goals"/></div>
          <p className="text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))] mb-0">Your profile stays in this browser. It is here to help tailor your own exploration.</p>
        </section>
      </div>
      <div className="flex flex-wrap items-center gap-4 mt-5">
        <button type="submit" className="button-primary" data-testid="button-save-profile"><Check size={15}/> Save my profile</button>
        {saved && <span className="text-[12px] font-bold text-[hsl(var(--primary))]" role="status" data-testid="status-profile-saved"><Check className="inline mr-1" size={14}/> Saved on this device</span>}
      </div>
    </form>
    </Form>
  </main>;
}

const radarSkills = [
  { name: 'AI tool fluency', demand: 84, direction: 'Growing', note: 'Try tools thoughtfully; verify their output.' },
  { name: 'Critical thinking', demand: 78, direction: 'Growing', note: 'Question assumptions and check evidence.' },
  { name: 'Clear communication', demand: 73, direction: 'Growing', note: 'Make ideas useful to different audiences.' },
  { name: 'Data interpretation', demand: 67, direction: 'Growing', note: 'Turn information into a grounded next step.' },
  { name: 'Repetitive manual data entry', demand: 31, direction: 'Declining', note: 'Routine copying may be a candidate for automation.' },
];

function RadarPage() {
  return <main className="page-content">
    <PageHeader eyebrow="Notice patterns, not promises" title="Future Skills Radar" description="A synthetic snapshot of skill themes to explore as work changes. Treat the relative scores as discussion prompts, not labor-market research."/>
    <SyntheticNote/>
    <div className="grid-main mt-5">
      <section className="card">
        <div className="flex justify-between items-start gap-3 mb-2"><div><div className="eyebrow">Sample signals / illustrative index</div><h2 className="text-[22px] mt-2 mb-1">Skills in the conversation</h2></div><span className="badge">Synthetic scale / 100</span></div>
        {radarSkills.map((item, i) => <div className="trend-row" key={item.name} data-testid={`radar-skill-${i}`}><div><div className="flex flex-wrap items-center gap-2 text-[13px] font-bold">{item.name}<span className={`trend-indicator ${item.direction === 'Declining' ? 'declining' : 'growing'}`} data-testid={`radar-direction-${i}`}>{item.direction} example</span></div><div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">{item.note}</div></div><div className="bar-track" aria-label={`${item.name} synthetic sample index ${item.demand} out of 100`}><div className="bar-fill" style={{ width: `${item.demand}%` }}/></div><span className="font-bold text-[13px] tabular-nums" data-testid={`radar-score-${i}`}>{item.demand}</span></div>)}
      </section>
      <section className="card card-muted">
        <div className="w-11 h-11 grid place-items-center rounded-xl bg-[hsl(var(--secondary))] text-[hsl(var(--primary))] mb-4"><Sparkles size={21}/></div>
        <div className="eyebrow">Read the radar wisely</div><h2 className="text-[24px] leading-tight mt-2">A prompt for reflection, not a ranking of your worth.</h2>
        <p className="text-[13px] text-[hsl(var(--muted-foreground))] leading-relaxed">The numbers are invented for this demo. Real opportunity varies by region, industry, access, and time. Think about which skill you would enjoy practicing—and what evidence would make you curious.</p>
        <Link href="/comparison" className="button-primary mt-2" data-testid="button-radar-profile">Compare with my profile <ArrowRight size={14}/></Link>
      </section>
    </div>
    <section className="mt-6">
      <div className="eyebrow mb-3">Transferable ways of working</div>
      <div className="flex flex-wrap gap-2">{['Ask better questions', 'Explain your reasoning', 'Check AI-generated work', 'Collaborate across disciplines', 'Keep learning in public'].map((tag, i) => <span className="badge !text-[11px] !px-3 !py-2" key={tag} data-testid={`tag-transferable-${i}`}>{tag}</span>)}</div>
    </section>
  </main>;
}

function SkillComparisonPage({ profile }: { profile: Profile }) {
  const savedSkills = profile.skills.filter((skill) => skill.name.trim());
  const comparisons = compareSkills(savedSkills, radarSkills);

  return <main className="page-content">
    <PageHeader
      eyebrow="Compare your saved skills"
      title="Profile comparison"
      description="See which Future Skills Radar examples are listed in your saved profile, along with the proficiency level you entered."
    />
    <SyntheticNote/>

    {savedSkills.length === 0 ? (
      <section className="card mt-5" data-testid="comparison-empty">
        <div className="eyebrow">No skills to compare yet</div>
        <h2 className="text-[24px] mt-2">Add a skill to your profile first.</h2>
        <p className="text-[13px] text-[hsl(var(--muted-foreground))] leading-relaxed">
          Enter at least one skill name and save your profile to see a comparison. A skill marked “Not provided” is simply not listed in your profile; it does not mean you lack that ability.
        </p>
        <Link href="/skills" className="button-primary mt-2" data-testid="button-comparison-complete-profile">
          Complete my profile <ArrowRight size={14}/>
        </Link>
      </section>
    ) : (
      <>
        <section className="card mt-5" data-testid="comparison-profile-summary">
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div>
              <div className="eyebrow">Saved profile</div>
              <h2 className="text-[20px] mt-2 mb-1">{savedSkills.length} skill{savedSkills.length === 1 ? '' : 's'} listed</h2>
            </div>
            <Link href="/skills" className="button-secondary" data-testid="link-comparison-edit-profile">
              Edit my profile <ArrowRight size={14}/>
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {savedSkills.map((skill, index) => (
              <span className="badge" key={`${skill.name}-${index}`} data-testid={`comparison-profile-skill-${index}`}>
                {skill.name} · {skill.level || 'Proficiency not provided'}
              </span>
            ))}
          </div>
        </section>

        <section className="card card-muted mt-5" data-testid="comparison-rules">
          <div className="eyebrow">How to read this comparison</div>
          <h2 className="text-[21px] mt-2 mb-3">Simple profile matching, not a career prediction.</h2>
          <ul className="pl-5 text-[12px] leading-[1.8] text-[hsl(var(--muted-foreground))]">
            <li>Names match when the wording is the same; capitalization and extra spaces are ignored. Synonyms are not guessed.</li>
            <li>“Not provided” means the skill name is not in your saved profile. It does not mean you lack the skill.</li>
            <li>For a listed skill, Exploring or Growing is flagged “Yes — practice may help.” Confident or Advanced is not flagged. Missing or unrecognized proficiency is “Not assessed.”</li>
            <li>If the same skill appears more than once, the highest recognized proficiency is used.</li>
          </ul>
          <p className="text-[11px] leading-relaxed mb-0">
            These are basic organizing rules, not a scientifically validated assessment. Radar indices and growth directions remain synthetic examples, not real-world demand data.
          </p>
        </section>

        <section className="mt-5 grid gap-3" aria-label="Skill comparison results">
          {comparisons.map((comparison, index) => (
            <article className="card comparison-card" key={comparison.radarSkill.name} data-testid={`comparison-row-${index}`}>
              <div>
                <div className="eyebrow">Radar skill</div>
                <h2 className="text-[20px] mt-2 mb-2">{comparison.radarSkill.name}</h2>
                <span className="badge">{comparison.radarSkill.direction} example</span>
                <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-3 mb-0" data-testid={`comparison-synthetic-index-${index}`}>
                  Synthetic sample index: {comparison.radarSkill.demand}/100
                </p>
              </div>
              <div className="comparison-facts">
                <div className="comparison-fact">
                  <div className="comparison-fact-label">Skill in profile?</div>
                  <div className="comparison-fact-value" data-testid={`comparison-presence-${index}`}>
                    {comparison.hasProfileSkill ? 'Provided' : 'Not provided'}
                  </div>
                </div>
                <div className="comparison-fact">
                  <div className="comparison-fact-label">Your proficiency</div>
                  <div className="comparison-fact-value" data-testid={`comparison-proficiency-${index}`}>
                    {comparison.proficiency}
                  </div>
                </div>
                <div className="comparison-fact">
                  <div className="comparison-fact-label">Needs improvement?</div>
                  <div className="comparison-fact-value" data-testid={`comparison-improvement-${index}`}>
                    {comparison.needsImprovement}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </>
    )}
  </main>;
}

const careers = [
  { role: 'AI-enabled Research Associate', field: 'Research & insight', score: 86, skills: ['Research & synthesis', 'Critical thinking'], missing: ['AI tool fluency', 'Data interpretation'], summary: 'Gather information, test assumptions, and help a team turn findings into clear decisions.' },
  { role: 'Content Operations Coordinator', field: 'Communications', score: 78, skills: ['Writing', 'Quality review'], missing: ['Workflow design', 'Content analytics'], summary: 'Coordinate content processes and use digital tools to keep information accurate and useful.' },
  { role: 'Learning Experience Designer', field: 'Education & enablement', score: 72, skills: ['Communication', 'Empathy'], missing: ['Learning design', 'Accessibility basics'], summary: 'Shape learning materials and experiences that help people build confidence with new ideas.' },
];

function CareersPage() {
  return <main className="page-content">
    <PageHeader eyebrow="Possibilities that connect" title="Career Matches" description="These example roles are here to spark curiosity. A match is a conversation starter—not an assessment or a promise of fit."/>
    <SyntheticNote/>
    <div className="flex items-center gap-2 mt-6 mb-4"><BriefcaseBusiness size={17} className="text-[hsl(var(--primary))]"/><h2 className="text-[20px] m-0">Three directions to explore</h2></div>
    <div className="grid-main">
      <div className="flex flex-col gap-3">
        {careers.map((career, i) => <article className="card" key={career.role} data-testid={`career-card-${i}`}>
          <div className="flex flex-wrap justify-between gap-3 items-start"><div><div className="eyebrow">{career.field}</div><h3 className="text-[23px] mt-2 mb-0">{career.role}</h3></div><span className="badge" data-testid={`career-score-${i}`}>{career.score}/100 synthetic match</span></div>
          <p className="text-[13px] text-[hsl(var(--muted-foreground))] leading-relaxed mt-3">{career.summary}</p>
          <div className="mb-3"><div className="eyebrow !text-[9px] mb-2">Related skills in this sample</div><div className="flex flex-wrap gap-2">{career.skills.map((skill) => <span className="text-[10px] border border-[hsl(var(--border))] rounded-full px-2.5 py-1" key={skill}>{skill}</span>)}</div></div>
          <div className="mb-4"><div className="eyebrow !text-[9px] mb-2">Skills to explore next</div><div className="flex flex-wrap gap-2">{career.missing.map((skill) => <span className="text-[10px] rounded-full px-2.5 py-1 bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]" key={skill}>{skill}</span>)}</div></div>
          <Link href="/roadmap" className="text-[hsl(var(--primary))] text-[12px] font-bold no-underline" data-testid={`link-career-roadmap-${i}`}>Explore a learning step <ArrowRight className="inline" size={14}/></Link>
        </article>)}
      </div>
      <aside className="card h-fit">
        <div className="w-10 h-10 rounded-xl bg-[hsl(var(--secondary))] grid place-items-center text-[hsl(var(--primary))] mb-4"><Bookmark size={18}/></div>
        <div className="eyebrow">How to use these matches</div><h2 className="text-[23px] mt-2">Curiosity beats certainty.</h2>
        <ul className="pl-5 text-[12px] leading-[1.8] text-[hsl(var(--muted-foreground))]">
          <li>Look for tasks you would like to try, not just a title.</li>
          <li>Ask someone in the field what their day actually includes.</li>
          <li>Try one small learning activity before making a big decision.</li>
        </ul>
        <Link href="/skills" className="button-secondary w-full mt-3" data-testid="button-edit-skills-careers">Update my skills <ArrowRight size={14}/></Link>
      </aside>
    </div>
  </main>;
}

const initialSteps = [
  { id: 'step-1', title: 'Practice checking AI output', detail: 'Compare a generated summary with its source. Note what was missed or overstated.', time: '25 min', resource: 'Free course: Elements of AI', resourceUrl: 'https://www.elementsofai.com/' },
  { id: 'step-2', title: 'Tell a clear story with data', detail: 'Choose a small public dataset and write three sentences about what it does and does not show.', time: '45 min', resource: 'Free lesson: Kaggle Learn — Data Visualization', resourceUrl: 'https://www.kaggle.com/learn/data-visualization' },
  { id: 'step-3', title: 'Talk with someone doing the work', detail: 'Ask how research, communication, and new tools appear in their actual week.', time: '30 min', resource: 'Low-cost example: an informational conversation through your school or community network.' },
];

function RoadmapPage() {
  const [done, setDone] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('future-ready-roadmap') || '[]'); } catch { return []; }
  });
  const toggle = (id: string) => setDone((current) => {
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    localStorage.setItem('future-ready-roadmap', JSON.stringify(next));
    return next;
  });
  return <main className="page-content">
    <PageHeader eyebrow="Small steps, your own pace" title="My Learning Roadmap" description="A sample three-step plan to build confidence through practice. Swap, skip, or adapt anything—your plan should fit your life."/>
    <SyntheticNote/>
    <div className="grid-main mt-5">
      <section className="card">
        <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[hsl(var(--border))] pb-4">
          <div><div className="eyebrow">A sample month</div><h2 className="text-[22px] mt-1 mb-0">Build a little momentum</h2></div>
          <span className="badge" data-testid="roadmap-progress">{done.length} of {initialSteps.length} complete</span>
        </div>
        {initialSteps.map((step, i) => <label className="roadmap-item cursor-pointer" key={step.id} data-testid={`roadmap-item-${step.id}`}>
          <input type="checkbox" checked={done.includes(step.id)} onChange={() => toggle(step.id)} aria-label={`Mark ${step.title} complete`} data-testid={`checkbox-${step.id}`}/>
          <span className="flex-1"><span className={`block text-[14px] font-bold ${done.includes(step.id) ? 'line-through opacity-55' : ''}`}>{String(i + 1).padStart(2, '0')} · {step.title}</span><span className="block text-[12px] leading-relaxed text-[hsl(var(--muted-foreground))] mt-1">{step.detail}</span><span className="block text-[11px] mt-2"><strong>Free or low-cost idea:</strong> {step.resourceUrl ? <a href={step.resourceUrl} target="_blank" rel="noreferrer" className="text-[hsl(var(--primary))] underline underline-offset-2">{step.resource}</a> : step.resource}</span></span>
          <span className="badge">{step.time}</span>
        </label>)}
      </section>
      <aside className="card card-muted h-fit">
        <div className="eyebrow">Keep it doable</div><h2 className="text-[24px] leading-tight mt-2">Progress is a practice, not a streak.</h2>
        <p className="text-[13px] text-[hsl(var(--muted-foreground))] leading-relaxed">Check off a step when it feels useful. Your progress is saved on this device, so you can return when you’re ready.</p>
        <div className="border-t border-[hsl(var(--border))] pt-4 mt-4 flex justify-between text-[12px]"><span>Sample time, if you do all steps</span><strong>About 1 hr 40 min</strong></div>
        <Link href="/careers" className="button-secondary w-full mt-5" data-testid="button-roadmap-careers">Back to career ideas <ArrowRight size={14}/></Link>
      </aside>
    </div>
  </main>;
}

const scenarioData = {
  moderate: {
    name: 'Moderate adoption', pace: 'Gradual, uneven integration',
    description: 'Some teams use AI for selected tasks while keeping familiar review and approval steps. Adoption differs across organizations.',
    tasks: ['Routine summaries may be drafted with assistance.', 'People continue to check sources and context.', 'Tool fluency grows alongside existing expertise.'],
    opportunity: 'Explore roles that blend subject knowledge with thoughtful tool use.',
  },
  fast: {
    name: 'Fast adoption', pace: 'Broad, quicker experimentation',
    description: 'Many teams try AI across more workflows in a shorter period. New expectations and new questions emerge at the same time.',
    tasks: ['More first drafts and repetitive steps may be assisted.', 'Human review, judgment, and accountability remain important.', 'Teams may need help adapting processes and communicating change.'],
    opportunity: 'Explore change support, quality review, and cross-functional collaboration.',
  },
};

function ScenariosPage() {
  const [active, setActive] = useState<'moderate' | 'fast' | 'compare'>('compare');
  const selected = active === 'compare' ? ['moderate', 'fast'] as const : [active] as const;
  return <main className="page-content">
    <PageHeader eyebrow="Consider more than one future" title="AI Scenario Comparison" description="No one knows exactly how adoption will unfold. Comparing imagined scenarios can help you prepare flexibly rather than betting on a single forecast."/>
    <div className="synthetic-note" data-testid="notice-scenarios"><strong>Synthetic scenarios, not forecasts.</strong> These adoption paths are illustrative examples created for exploration. They are not verified predictions or real-world facts.</div>
    <div className="flex flex-wrap gap-2 mt-5 mb-5" role="group" aria-label="Choose scenarios to display">
      {(['compare', 'moderate', 'fast'] as const).map((mode) => <button type="button" key={mode} onClick={() => setActive(mode)} className={active === mode ? 'button-primary' : 'button-secondary'} aria-pressed={active === mode} data-testid={`button-scenario-${mode}`}>{mode === 'compare' ? 'Compare both' : scenarioData[mode].name}</button>)}
    </div>
    <div className="scenario-grid">
      {selected.map((key) => {
        const scenario = scenarioData[key];
        return <article className={`card scenario-panel ${key === 'fast' ? 'fast' : ''}`} key={key} data-testid={`scenario-panel-${key}`}>
          <div className="eyebrow">{key === 'fast' ? 'Scenario B / illustrative' : 'Scenario A / illustrative'}</div>
          <h2 className="text-[27px] mt-2 mb-1">{scenario.name}</h2><div className="text-[12px] text-[hsl(var(--muted-foreground))]">{scenario.pace}</div>
          <p className="text-[13px] leading-relaxed mt-4">{scenario.description}</p>
          <div className="border-t border-[hsl(var(--border))] mt-5 pt-4"><div className="eyebrow mb-2">What could change in this example</div>
            <ul className="pl-5 text-[12px] leading-[1.85] text-[hsl(var(--muted-foreground))]">{scenario.tasks.map((task) => <li key={task}>{task}</li>)}</ul>
          </div>
          <div className="rounded-lg bg-[hsl(var(--muted))] p-3 mt-4"><div className="text-[10px] uppercase font-bold tracking-[.1em]">A flexible move</div><p className="text-[12px] leading-relaxed mb-0 mt-1">{scenario.opportunity}</p></div>
        </article>;
      })}
    </div>
    <section className="card mt-5 flex flex-wrap items-center justify-between gap-4">
      <div><div className="eyebrow">Make your own next move</div><h2 className="text-[21px] mt-1 mb-1">Build skills that help across scenarios.</h2><p className="text-[12px] text-[hsl(var(--muted-foreground))] m-0">Start with your strengths, then choose a small skill to practice.</p></div>
      <Link href="/roadmap" className="button-primary" data-testid="button-scenario-roadmap">Open my roadmap <ArrowRight size={14}/></Link>
    </section>
  </main>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router({ profile, onSave }: { profile: Profile; onSave: (profile: Profile) => void }) {
  return <RoutedErrorBoundary><Shell>
    <Switch>
      <Route path="/"><HomePage profile={profile}/></Route>
      <Route path="/skills"><SkillsPage profile={profile} onSave={onSave}/></Route>
      <Route path="/radar"><RadarPage/></Route>
      <Route path="/comparison"><SkillComparisonPage profile={profile}/></Route>
      <Route path="/careers"><CareersPage/></Route>
      <Route path="/roadmap"><RoadmapPage/></Route>
      <Route path="/scenarios"><ScenariosPage/></Route>
      <Route component={NotFound}/>
    </Switch>
  </Shell></RoutedErrorBoundary>;
}

function App() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  useEffect(() => { try { localStorage.setItem('future-ready-profile', JSON.stringify(profile)); } catch { /* Local persistence may be unavailable in private browsing. */ } }, [profile]);
  const saveProfile = (next: Profile) => {
    setProfile(next);
    try { localStorage.setItem('future-ready-profile', JSON.stringify(next)); } catch { /* Keep the in-memory profile for this session. */ }
  };
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router profile={profile} onSave={saveProfile}/></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>;
}

export default App;
