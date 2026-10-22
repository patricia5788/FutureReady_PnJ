import { useEffect, useState } from 'react';
import { Activity, ArrowRight, Clock3, ExternalLink, RefreshCw, ShieldAlert } from 'lucide-react';
import {
  useGetMarketSignals,
  useGetAiInsightsStatus,
  usePostAiInsights,
  type AiInsightsRequest,
  type MarketSignalsResponse,
} from '@workspace/api-client-react';
import { Link } from 'wouter';
import { careers, findCareer } from '@/data/career-catalog';
import { reportSignals } from '@/data/trend-signals';
import { analyzeCareer } from '@/lib/career-matching';
import type { Profile } from '@/lib/profile';
import { InfoNote, PageHeader, SourceLabel, SourceLink } from '@/components/app-shell';
import { SafeMarkdown } from '@/components/safe-markdown';

type ScenarioMode = 'both' | 'moderate' | 'fast';

const localCacheKey = 'future-ready-last-market-signals';
const aiHandleKey = 'future-ready-ai-insight-handle';

const scenarioContent = {
  moderate: {
    name: 'Moderate AI Adoption',
    assumption: 'AI tools are introduced gradually and unevenly. People continue to review important outputs and keep existing workflows where they work well.',
    implications: 'Build the role foundations in your profile, then practice using AI as an assistive tool while checking its output against evidence and domain knowledge.',
  },
  fast: {
    name: 'Fast AI Adoption',
    assumption: 'Organizations try AI across more workflows in a shorter period. Adoption can still differ by team, regulation, access, and the type of work.',
    implications: 'Alongside role foundations, consider workflow evaluation, secure data handling, testing, and clear communication about AI-assisted work.',
  },
};

function readCachedSignals(): MarketSignalsResponse | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(localCacheKey) || 'null');
    if (!parsed || typeof parsed !== 'object') return null;
    const value = parsed as Partial<MarketSignalsResponse>;
    return typeof value.status === 'string' && Array.isArray(value.items)
      ? value as MarketSignalsResponse
      : null;
  } catch {
    return null;
  }
}

function formatDate(value: string | null | undefined): string {
  if (!value) return 'Not supplied';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-MY', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function scenarioFocus(profile: Profile, careerId: string) {
  const career = findCareer(careerId);
  if (!career || !profile.skills.length) return 'No saved profile is selected for this scenario view; the assumptions remain general.';

  const match = analyzeCareer(profile, career);
  const developing = match.developing.slice(0, 2).map((item) => item.requirement.name);
  const notListed = match.unprovided.slice(0, 2).map((item) => item.requirement.name);
  const parts: string[] = [];
  if (developing.length) parts.push(`Provided skills below the catalog target: ${developing.join(', ')}.`);
  if (notListed.length) parts.push(`Not listed and therefore unassessed: ${notListed.join(', ')}.`);
  if (!parts.length) parts.push('All currently listed role requirements meet the catalog target; unlisted requirements remain unassessed.');
  return parts.join(' ');
}

export function AiTrendsScenariosPage({ profile }: { profile: Profile }) {
  const [mode, setMode] = useState<ScenarioMode>('both');
  const [selectedCareerId, setSelectedCareerId] = useState(profile.targetCareer || 'all');
  const [cachedSignals, setCachedSignals] = useState<MarketSignalsResponse | null>(readCachedSignals);
  const feedQuery = useGetMarketSignals({
    query: { queryKey: ['market-signals'], staleTime: 10 * 60 * 1000, retry: false, refetchOnWindowFocus: false },
  });
  const [trackingHandle, setTrackingHandle] = useState<string | null>(() => {
    try { return localStorage.getItem(aiHandleKey); } catch { return null; }
  });
  const aiMutation = usePostAiInsights({
    mutation: {
      retry: false,
      onSuccess: (result) => {
        setTrackingHandle(result.trackingHandle);
        try { localStorage.setItem(aiHandleKey, result.trackingHandle); } catch { /* DB deduplication still protects retries. */ }
      },
    },
  });
  const aiStatusQuery = useGetAiInsightsStatus(trackingHandle ?? '', {
    query: {
      queryKey: ['ai-insight-status', trackingHandle],
      enabled: Boolean(trackingHandle),
      refetchInterval: (query) => ['SUBMITTING', 'IN_QUEUE', 'IN_PROGRESS'].includes(query.state.data?.status ?? '') ? 5_000 : false,
      retry: false,
    },
  });

  useEffect(() => {
    if (feedQuery.data?.status === 'live') {
      try {
        localStorage.setItem(localCacheKey, JSON.stringify(feedQuery.data));
        setCachedSignals(feedQuery.data);
      } catch {
        // Continue with the response in memory if local storage is unavailable.
      }
    }
  }, [feedQuery.data]);

  const response = feedQuery.data;
  const signalData = response?.status === 'live' || response?.status === 'stale'
    ? response
    : cachedSignals;
  const feedError = response?.error ?? (feedQuery.error ? 'The live job-listing feed is temporarily unavailable.' : null);
  const selectedCareer = findCareer(selectedCareerId === 'all' ? profile.targetCareer : selectedCareerId);
  const visibleReportSignals = selectedCareer
    ? reportSignals.filter((signal) => signal.relatedCareerIds.includes(selectedCareer.id))
    : reportSignals;
  const scenarios = mode === 'both'
    ? (['moderate', 'fast'] as const)
    : [mode] as const;
  const canGenerateInsights = Boolean(selectedCareer && profile.skills.length > 0);

  const refresh = async () => {
    await feedQuery.refetch();
  };

  const generateInsights = () => {
    if (!selectedCareer || !profile.skills.length) return;
    if (trackingHandle) return;
    const match = analyzeCareer(profile, selectedCareer);
    const request: AiInsightsRequest = {
      careerId: selectedCareer.id as AiInsightsRequest['careerId'],
      skills: profile.skills.map(({ name, level }) => ({ name, level })),
      skillGaps: [...match.developing, ...match.unprovided]
        .map((item) => item.requirement.name)
        .slice(0, 12),
      jobSignals: (signalData?.items ?? []).slice(0, 4).map((job) => ({
        title: job.title,
        category: job.category,
        publishedAt: job.publishedAt,
        tags: job.tags.slice(0, 5),
      })),
    };
    aiMutation.mutate({ data: request });
  };

  const clearSavedInsight = () => {
    setTrackingHandle(null);
    aiMutation.reset();
    try { localStorage.removeItem(aiHandleKey); } catch { /* Server-side request deduplication remains active. */ }
  };

  return (
    <main className="page-content">
      <PageHeader
        eyebrow="Evidence, assumptions, and uncertainty"
        title="AI Trends & Scenarios"
        description="Review dated research and individual remote-job listings, then compare two team-defined adoption scenarios for an IT career."
        action={
          <button type="button" className="button-secondary" onClick={refresh} disabled={feedQuery.isFetching} data-testid="button-refresh-signals">
            <RefreshCw size={14} className={feedQuery.isFetching ? 'animate-spin' : ''}/>
            {feedQuery.isFetching ? 'Checking…' : 'Check for updated listings'}
          </button>
        }
      />

      <InfoNote className="mb-5" data-testid="notice-scenarios">
        <strong>Scenarios are estimates, not predictions.</strong> The WEF report is an external employer forecast. Job cards are individual postings from a delayed public feed. Moderate and fast adoption are team-defined assumptions, not measured probabilities or job-growth percentages.
      </InfoNote>

      <section className="card mb-5" data-testid="market-feed-status">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="eyebrow">Updatable public job-market signal</div>
            <h2 className="text-[21px] mt-1 mb-1">Remote IT job listings</h2>
            <p className="text-[11px] text-[hsl(var(--muted-foreground))] m-0">
              This is a keyword-filtered sample, not a count of all vacancies or a representative Malaysia-market statistic.
            </p>
          </div>
          <SourceLabel>
            {feedQuery.isLoading && !signalData ? 'Loading source' :
              signalData?.status === 'stale' ? 'Stale cache' :
                signalData?.status === 'live' ? signalData.cached ? 'Cached source response' : 'Source checked' :
                  'Source unavailable'}
          </SourceLabel>
        </div>

        {feedError && (
          <div className="rounded-lg bg-[hsl(var(--muted))] p-3 mt-4 text-[11px] leading-relaxed" role="status" data-testid="market-feed-error">
            <ShieldAlert className="inline mr-1" size={14}/>
            {feedError} {signalData?.fetchedAt ? `Showing the last successful update from ${formatDate(signalData.fetchedAt)}.` : 'No saved live result is available; the dated report signals below remain available.'}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3 mt-4 text-[11px]">
          <div className="data-fact">
            <div className="data-fact-label">Source</div>
            <div className="data-fact-value">
              {signalData
                ? <SourceLink href={signalData.sourceUrl}>{signalData.sourceName}</SourceLink>
                : <SourceLink href="https://remotive.com/remote-jobs/api">Remotive Remote Jobs Public API</SourceLink>}
            </div>
          </div>
          <div className="data-fact">
            <div className="data-fact-label">Last successful retrieval</div>
            <div className="data-fact-value" data-testid="market-feed-updated">{formatDate(signalData?.fetchedAt)}</div>
          </div>
          {signalData?.cacheExpiresAt && (
            <div className="data-fact sm:col-span-2">
              <div className="data-fact-label">Next upstream check after</div>
              <div className="data-fact-value">{formatDate(signalData.cacheExpiresAt)} · the provider recommends infrequent requests</div>
            </div>
          )}
        </div>

        <p className="text-[10px] leading-relaxed text-[hsl(var(--muted-foreground))] mt-4 mb-0" data-testid="market-feed-delay">
          Remotive states its listings are delayed by about 24 hours. This demo credits Remotive and links each listing back to its original Remotive page. Listings may be global or remote and are not specific to Malaysia.
        </p>

        {signalData?.items.length ? (
          <div className="grid-main mt-4" data-testid="market-listings">
            {signalData.items.map((job) => (
              <article className="stat-tile" key={job.id} data-testid={`market-job-${job.id}`}>
                <div className="eyebrow">{job.category}</div>
                <h3 className="text-[14px] mt-2 mb-1">{job.title}</h3>
                <div className="text-[11px] text-[hsl(var(--muted-foreground))]">{job.company} · {job.location}</div>
                <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-2">Published by source: {formatDate(job.publishedAt)}</div>
                {job.tags.length > 0 && <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-2">Tags: {job.tags.slice(0, 5).join(', ')}</div>}
                <a href={job.url} target="_blank" rel="noreferrer" className="text-[hsl(var(--primary))] text-[11px] font-bold underline underline-offset-2 mt-3 inline-flex items-center gap-1">
                  View on Remotive <ExternalLink size={12}/>
                </a>
              </article>
            ))}
          </div>
        ) : signalData?.status === 'error' || !signalData ? (
          <div className="card-muted rounded-lg p-4 mt-4 text-[12px]" data-testid="market-feed-fallback">
            No live listings are available right now. The dated WEF evidence below is a report snapshot, not live fallback data.
          </div>
        ) : (
          <div className="text-[12px] text-[hsl(var(--muted-foreground))] mt-4" data-testid="market-feed-empty">The source returned no matching IT listings in this response.</div>
        )}
      </section>

      <section className="card mb-5">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <div className="eyebrow">Dated external evidence</div>
            <h2 className="text-[22px] mt-1 mb-1">Research signals</h2>
            <p className="text-[11px] text-[hsl(var(--muted-foreground))] m-0">Longer-horizon employer expectations are separate from observed job listings.</p>
          </div>
          <label className="field !mb-0 min-w-[210px]">
            <span className="sr-only">Filter research by IT career</span>
            <select value={selectedCareerId} onChange={(event) => setSelectedCareerId(event.target.value)} data-testid="select-trend-career">
              <option value="all">All IT careers</option>
              {careers.map((career) => <option value={career.id} key={career.id}>{career.name}</option>)}
            </select>
          </label>
        </div>
        <div className="grid-main mt-4" data-testid="report-signals">
          {visibleReportSignals.map((signal) => (
            <article className="stat-tile" key={signal.id} data-testid={`report-signal-${signal.id}`}>
              <div className="eyebrow">External report / forecast</div>
              <h3 className="text-[15px] mt-2 mb-2">{signal.headline}</h3>
              <p className="text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))]">{signal.evidence}</p>
              <div className="text-[10px] text-[hsl(var(--muted-foreground))]">Published: {signal.publicationDate}</div>
              <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1">Snapshot date in supplied CSV: {signal.snapshotDate}</div>
              <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-2">Related skills: {signal.relatedSkills.join(', ')}</div>
              <div className="text-[10px] leading-relaxed mt-2">Limit: {signal.limitation}</div>
              <SourceLink href={signal.sourceUrl}>{signal.sourceName}</SourceLink>
            </article>
          ))}
        </div>
      </section>

      <section className="card mb-5">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-[hsl(var(--secondary)/.38)] text-[hsl(var(--primary))] grid place-items-center"><Activity size={18}/></span>
          <div><div className="eyebrow">Scenario lens</div><h2 className="text-[22px] mt-1 mb-0">Compare both adoption paths</h2></div>
        </div>
        <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-3 mb-0">
          Implications below are team-defined. Changing the live feed updates the dated evidence cards above; it does not automatically prove or change an adoption forecast.
        </p>
        <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label="Choose scenarios to display">
          {(['both', 'moderate', 'fast'] as const).map((option) => (
            <button type="button" key={option} onClick={() => setMode(option)} className={mode === option ? 'button-primary' : 'button-secondary'} aria-pressed={mode === option} data-testid={`button-scenario-${option}`}>
              {option === 'both' ? 'Compare both' : scenarioContent[option].name}
            </button>
          ))}
        </div>
        <section className="card-muted rounded-xl p-4 mt-4" data-testid="ai-insights-section">
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div>
              <div className="eyebrow">Optional AI explanation</div>
              <h3 className="text-[18px] mt-1 mb-1">Get a second, plain-language view</h3>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))] max-w-[700px] leading-relaxed m-0" data-testid="ai-insights-privacy">
                Clicking sends your selected career, skill names and levels, locally calculated skill gaps, and up to four short job-listing summaries to the configured Runpod endpoint. Education, interests, goals, and contact information are not sent.
              </p>
            </div>
            <button
              type="button"
              className="button-primary"
              onClick={generateInsights}
              disabled={!canGenerateInsights || aiMutation.isPending || Boolean(trackingHandle)}
              data-testid="button-ai-insights"
            >
              {aiMutation.isPending ? 'Submitting…' : trackingHandle ? 'Insight job saved' : 'Generate AI Career Insights'}
            </button>
          </div>
          {!canGenerateInsights && (
            <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-3 mb-0" data-testid="ai-insights-needs-profile">
              Save at least one skill and choose a target career to enable AI insights. <Link href="/skills" className="text-[hsl(var(--primary))] font-bold">Open your profile</Link>
            </p>
          )}
          {(aiMutation.isPending || ['SUBMITTING', 'IN_QUEUE', 'IN_PROGRESS'].includes(aiStatusQuery.data?.status ?? '')) && <p className="text-[12px] mt-3 mb-0" role="status" data-testid="ai-insights-loading">Your insight is {aiStatusQuery.data?.status === 'IN_QUEUE' ? 'queued' : 'processing'}. This page checks its status every 5 seconds.</p>}
          {(aiMutation.isError || aiStatusQuery.isError || ['FAILED', 'CANCELLED', 'TIMED_OUT', 'EXPIRED', 'SUBMISSION_UNKNOWN'].includes(aiStatusQuery.data?.status ?? '')) && (
            <div className="rounded-lg bg-[hsl(var(--muted))] p-3 mt-3 text-[12px]" role="alert" data-testid="ai-insights-error">
              AI Insights are temporarily unavailable for this demo. Your profile-based career guidance and scenario comparison are still available.
            </div>
          )}
          {aiStatusQuery.data?.status === 'COMPLETED' && aiStatusQuery.data.insights && (
            <div className="border-t border-[hsl(var(--border))] mt-4 pt-4" data-testid="ai-insights-result">
              <div className="flex flex-wrap justify-between gap-2 items-center">
                <div className="eyebrow">Generated guidance · not a career prediction</div>
                <span className="text-[10px] text-[hsl(var(--muted-foreground))]">
                  {aiStatusQuery.data.model} · {formatDate(aiStatusQuery.data.generatedAt)}
                </span>
              </div>
              <div className="text-[12px] leading-relaxed mt-3" data-testid="ai-insights-text">
                <SafeMarkdown content={aiStatusQuery.data.insights}/>
              </div>
            </div>
          )}
          {trackingHandle && !['SUBMITTING', 'IN_QUEUE', 'IN_PROGRESS'].includes(aiStatusQuery.data?.status ?? '') && (
            <button type="button" className="button-secondary mt-3" onClick={clearSavedInsight} data-testid="button-clear-ai-insight">
              Clear saved insight
            </button>
          )}
        </section>
        <div className="scenario-grid mt-4" data-testid="scenario-results">
          {scenarios.map((key) => {
            const scenario = scenarioContent[key];
            return (
              <article className={`card scenario-panel ${key === 'fast' ? 'fast' : ''}`} key={key} data-testid={`scenario-panel-${key}`}>
                <div className="eyebrow">{key === 'fast' ? 'Team-defined scenario B' : 'Team-defined scenario A'}</div>
                <h3 className="text-[23px] mt-2 mb-1">{scenario.name}</h3>
                <p className="text-[12px] leading-relaxed mt-3">{scenario.assumption}</p>
                <div className="rounded-lg bg-[hsl(var(--muted))] p-3 mt-3">
                  <div className="text-[10px] uppercase font-bold tracking-[.1em]">For {selectedCareer?.name ?? 'your IT career'}</div>
                  <p className="text-[12px] leading-relaxed mb-0 mt-1">{scenario.implications}</p>
                </div>
                <div className="border-t border-[hsl(var(--border))] mt-4 pt-3">
                  <div className="eyebrow">Your profile context</div>
                  <p className="text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))] mt-2 mb-0" data-testid={`scenario-profile-${key}`}>
                    {selectedCareer ? scenarioFocus(profile, selectedCareer.id) : 'Choose a target career on your profile to show role-specific skill context.'}
                  </p>
                </div>
                <div className="border-t border-[hsl(var(--border))] mt-4 pt-3">
                  <div className="eyebrow">Evidence available to review</div>
                  <p className="text-[11px] leading-relaxed text-[hsl(var(--muted-foreground))] mt-2 mb-0">
                    {visibleReportSignals.length} dated research signal{visibleReportSignals.length === 1 ? '' : 's'} for this view; {signalData?.items.length ?? 0} current listing examples. These are context, not proof that this scenario will occur.
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card flex flex-wrap justify-between items-center gap-3">
        <div><div className="eyebrow">Choose a practical next step</div><h2 className="text-[20px] mt-1 mb-0">Use your profile to build a learning pathway.</h2></div>
        <Link href="/roadmap" className="button-primary" data-testid="button-trends-roadmap">Open My Learning Roadmap <ArrowRight size={14}/></Link>
      </section>

      <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-4 flex items-center gap-1"><Clock3 size={12}/> Feed requests are cached for 12 hours to avoid overloading the public source.</div>
    </main>
  );
}

