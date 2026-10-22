import { GetMarketSignalsResponse } from '@workspace/api-zod';
import { Router, type IRouter } from 'express';

const router: IRouter = Router();
const remotiveApiUrl = 'https://remotive.com/api/remote-jobs?limit=50';
const remotiveSourceUrl = 'https://remotive.com/remote-jobs/api';
const cacheDurationMs = 12 * 60 * 60 * 1000;

type SignalPayload = {
  status: 'live' | 'stale' | 'error';
  sourceName: string;
  sourceUrl: string;
  fetchedAt: string | null;
  cacheExpiresAt: string | null;
  cached: boolean;
  items: {
    id: string;
    title: string;
    company: string;
    category: string;
    location: string;
    publishedAt: string;
    url: string;
    tags: string[];
  }[];
  error: string | null;
};

let lastSuccessfulResponse: SignalPayload | undefined;

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isItListing(job: Record<string, unknown>): boolean {
  const searchable = `${asText(job.title)} ${asText(job.category)}`.toLowerCase();
  return /software|developer|programmer|data analyst|data scientist|cyber|security|cloud|network|ai engineer|machine learning|devops|system admin|service desk|information technology|qa engineer/.test(searchable);
}

function mapJob(value: unknown): SignalPayload['items'][number] | undefined {
  if (!value || typeof value !== 'object') return undefined;

  const job = value as Record<string, unknown>;
  const url = asText(job.url);
  const title = asText(job.title);
  if (!title || !url.startsWith('https://remotive.com/remote-jobs/')) return undefined;

  const tags = Array.isArray(job.tags)
    ? job.tags.filter((tag): tag is string => typeof tag === 'string').map((tag) => tag.trim()).filter(Boolean)
    : [];

  return {
    id: String(job.id ?? url),
    title,
    company: asText(job.company_name) || 'Company not listed',
    category: asText(job.category) || 'Category not listed',
    location: asText(job.candidate_required_location) || 'Location not listed',
    publishedAt: asText(job.publication_date),
    url,
    tags,
  };
}

router.get('/market-signals', async (req, res): Promise<void> => {
  const now = Date.now();
  if (lastSuccessfulResponse && now < Date.parse(lastSuccessfulResponse.cacheExpiresAt ?? '')) {
    res.json(
      GetMarketSignalsResponse.parse({
        ...lastSuccessfulResponse,
        status: 'live',
        cached: true,
        error: null,
      }),
    );
    return;
  }

  try {
    const upstream = await fetch(remotiveApiUrl, {
      headers: { accept: 'application/json', 'user-agent': 'FutureReady university career exploration demo' },
      signal: AbortSignal.timeout(12_000),
    });
    if (!upstream.ok) {
      throw new Error(`The public listings source returned HTTP ${upstream.status}.`);
    }

    const raw: unknown = await upstream.json();
    const rawJobs =
      raw && typeof raw === 'object' && Array.isArray((raw as Record<string, unknown>).jobs)
        ? ((raw as Record<string, unknown>).jobs as unknown[])
        : [];
    const items = rawJobs
      .filter((job): job is Record<string, unknown> => Boolean(job) && typeof job === 'object')
      .filter(isItListing)
      .map(mapJob)
      .filter((job): job is SignalPayload['items'][number] => Boolean(job))
      .slice(0, 12);

    const fetchedAt = new Date().toISOString();
    const response: SignalPayload = {
      status: 'live',
      sourceName: 'Remotive Remote Jobs Public API',
      sourceUrl: remotiveSourceUrl,
      fetchedAt,
      cacheExpiresAt: new Date(Date.now() + cacheDurationMs).toISOString(),
      cached: false,
      items,
      error: null,
    };
    GetMarketSignalsResponse.parse(response);
    lastSuccessfulResponse = response;
    res.json(response);
  } catch (error) {
    req.log.warn({ err: error }, 'Unable to refresh the public market-signal feed');
    const message = 'The live job-listing feed is temporarily unavailable.';
    if (lastSuccessfulResponse) {
      res.json(
        GetMarketSignalsResponse.parse({
          ...lastSuccessfulResponse,
          status: 'stale',
          cached: true,
          error: message,
        }),
      );
      return;
    }

    res.json(
      GetMarketSignalsResponse.parse({
        status: 'error',
        sourceName: 'Remotive Remote Jobs Public API',
        sourceUrl: remotiveSourceUrl,
        fetchedAt: null,
        cacheExpiresAt: null,
        cached: false,
        items: [],
        error: message,
      }),
    );
  }
});

export default router;
