import { GetAiInsightsStatusParams, PostAiInsightsBody } from '@workspace/api-zod';
import { Router, type IRouter } from 'express';
import { AiInsightsError, getAiInsightsStatus, startAiInsights } from '../lib/ai-insights';

const router: IRouter = Router();

router.post('/ai-insights', async (req, res): Promise<void> => {
  const parsed = PostAiInsightsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Please provide a valid career, skill profile, and brief signal summary.' });
    return;
  }
  try {
    res.status(202).json(await startAiInsights(parsed.data, req.ip || 'unknown'));
  } catch (error) {
    if (error instanceof AiInsightsError) {
      if (error.statusCode === 429) req.log.info('AI insight request rate-limited');
      else req.log.warn({ statusCode: error.statusCode }, 'AI insight job could not be started');
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    req.log.error('Unexpected AI insight submission failure');
    res.status(503).json({ error: 'AI insights are unavailable. Rule-based career guidance is still available.' });
  }
});

router.get('/ai-insights/:trackingHandle', async (req, res): Promise<void> => {
  const parsed = GetAiInsightsStatusParams.safeParse({ trackingHandle: req.params.trackingHandle });
  if (!parsed.success) {
    res.status(404).json({ error: 'This insight tracking link is not valid.' });
    return;
  }
  try {
    res.json(await getAiInsightsStatus(parsed.data.trackingHandle));
  } catch (error) {
    if (error instanceof AiInsightsError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    req.log.error('Unexpected AI insight status failure');
    res.status(503).json({ error: 'The existing insight status could not be read.' });
  }
});

export default router;
