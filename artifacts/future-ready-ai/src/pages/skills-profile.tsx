import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Check, Plus, Trash2 } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { careers } from '@/data/career-catalog';
import { PageHeader, InfoNote } from '@/components/app-shell';
import { syntheticGraduateProfile, type Profile } from '@/lib/profile';

export function SkillsProfilePage({ profile, onSave }: { profile: Profile; onSave: (profile: Profile) => void }) {
  const form = useForm<Profile>({ defaultValues: profile });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'skills' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    form.reset(profile);
  }, [profile, form]);

  const save = form.handleSubmit((values) => {
    const clean: Profile = {
      ...values,
      skills: values.skills.filter((skill) => skill.name.trim()),
    };
    onSave(clean);
    form.reset(clean);
    setSaved(true);
  });

  const loadExample = () => {
    form.reset(structuredClone(syntheticGraduateProfile));
    setSaved(false);
  };

  return (
    <main className="page-content">
      <PageHeader
        eyebrow="Start with what you bring"
        title="My Skills Profile"
        description="Enter your education, experience, interests, goals, and IT skills. The profile stays in this browser."
      />
      <InfoNote className="mb-5 max-w-[900px]" data-testid="notice-profile-privacy">
        <strong>Demo guidance.</strong> You can begin with the fictional IT graduate example. Do not enter real CVs, sensitive personal details, or information you do not want stored in this browser.
      </InfoNote>

      <Form {...form}>
        <form onSubmit={save} className="max-w-[1000px]">
          <section className="card mb-5">
            <div className="flex flex-wrap justify-between items-start gap-3 mb-5">
              <div>
                <div className="eyebrow">01 / Skills</div>
                <h2 className="text-[23px] mt-2 mb-1">What can you do today?</h2>
                <p className="text-[12px] text-[hsl(var(--muted-foreground))] m-0">Use Beginner, Intermediate, or Advanced. This maps to 1, 2, or 3 in the match formula.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={loadExample} className="button-secondary" data-testid="button-load-synthetic-profile">Load synthetic IT graduate</button>
                <button type="button" onClick={() => { append({ name: '', level: 'Beginner', experience: 'Just starting' }); setSaved(false); }} className="button-secondary" data-testid="button-add-skill"><Plus size={15}/> Add a skill</button>
              </div>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-xl border border-dashed border-[hsl(var(--border))]" data-testid="empty-skills">
                <p className="font-bold text-[14px]">No skills have been saved yet.</p>
                <p className="text-[12px] text-[hsl(var(--muted-foreground))]">Add an IT skill or load the fictional example to try the matching flow.</p>
                <button type="button" className="button-primary" onClick={() => { append({ name: '', level: 'Beginner', experience: 'Just starting' }); setSaved(false); }} data-testid="button-add-first-skill"><Plus size={14}/> Add first skill</button>
              </div>
            ) : fields.map((field, index) => (
              <div className="skill-row" key={field.id} data-testid={`row-skill-${index}`}>
                <label className="sr-only" htmlFor={`skill-name-${index}`}>Skill name {index + 1}</label>
                <input id={`skill-name-${index}`} aria-label={`Skill name ${index + 1}`} {...form.register(`skills.${index}.name`, { onChange: () => setSaved(false) })} placeholder="Skill name" data-testid={`input-skill-name-${index}`}/>
                <label className="sr-only" htmlFor={`skill-level-${index}`}>Proficiency level for {field.name || `skill ${index + 1}`}</label>
                <select id={`skill-level-${index}`} {...form.register(`skills.${index}.level`, { onChange: () => setSaved(false) })} data-testid={`select-skill-level-${index}`}>
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
                <label className="sr-only" htmlFor={`skill-experience-${index}`}>Experience with {field.name || `skill ${index + 1}`}</label>
                <select id={`skill-experience-${index}`} {...form.register(`skills.${index}.experience`, { onChange: () => setSaved(false) })} data-testid={`select-skill-experience-${index}`}>
                  <option>Just starting</option><option>Under 1 year</option><option>1–2 years</option><option>2–4 years</option><option>5+ years</option>
                </select>
                <button type="button" onClick={() => { remove(index); setSaved(false); }} className="w-9 h-9 grid place-items-center rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]" aria-label={`Remove ${field.name || `skill ${index + 1}`}`} data-testid={`button-remove-skill-${index}`}><Trash2 size={15}/></button>
              </div>
            ))}
          </section>

          <div className="grid-main">
            <section className="card">
              <div className="eyebrow">02 / Background</div>
              <h2 className="text-[22px] mt-2 mb-5">Where are you in your journey?</h2>
              <div className="field">
                <label htmlFor="education">Education or IT background</label>
                <input id="education" {...form.register('education', { onChange: () => setSaved(false) })} placeholder="For example, IT diploma or self-taught projects" data-testid="input-education"/>
              </div>
              <div className="field">
                <label htmlFor="experience">Current experience stage</label>
                <select id="experience" {...form.register('experience', { onChange: () => setSaved(false) })} data-testid="select-experience">
                  <option value="">Choose a stage</option><option>Student</option><option>Fresh graduate</option><option>Early career</option><option>Mid-career</option><option>Exploring a career change</option><option>Other</option>
                </select>
              </div>
              <div className="field !mb-0">
                <label htmlFor="interests">Interests and topics you care about</label>
                <textarea id="interests" {...form.register('interests', { onChange: () => setSaved(false) })} placeholder="What kinds of technical problems hold your attention?" data-testid="input-interests"/>
              </div>
            </section>
            <section className="card">
              <div className="eyebrow">03 / Direction</div>
              <h2 className="text-[22px] mt-2 mb-5">What would you like to explore?</h2>
              <div className="field">
                <label htmlFor="targetCareer">Target career for your learning pathway</label>
                <select id="targetCareer" {...form.register('targetCareer', { onChange: () => setSaved(false) })} data-testid="select-target-career">
                  <option value="">Choose later</option>
                  {careers.map((career) => <option value={career.id} key={career.id}>{career.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="goals">Career goals or questions</label>
                <textarea id="goals" {...form.register('goals', { onChange: () => setSaved(false) })} placeholder="A role, a question, or a possibility…" data-testid="input-career-goals"/>
              </div>
              <p className="text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))] mb-0">Your profile is saved in local browser storage. No login, CV upload, or external profile service is used.</p>
            </section>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-5">
            <button type="submit" className="button-primary" data-testid="button-save-profile"><Check size={15}/> Save my profile</button>
            {saved && <span className="text-[12px] font-bold text-[hsl(var(--primary))]" role="status" data-testid="status-profile-saved"><Check className="inline mr-1" size={14}/> Saved on this device</span>}
          </div>
        </form>
      </Form>
    </main>
  );
}

