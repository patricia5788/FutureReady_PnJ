import { PostAiInsightsBody } from '@workspace/api-zod';
import { Router, type IRouter } from 'express';
import { AiInsightsError, getAiInsights } from '../lib/ai-insights';

const router: IRouter = Router();

router.post('/ai-insights', async (req, res): Promise<void> => {
  const parsed = PostAiInsightsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Please provide a valid career, skill profile, and brief signal summary.' });
    return;
  }

  try {
    const result = await getAiInsights(parsed.data, req.ip || 'unknown');
    res.json(result);
  } catch (error) {
    if (error instanceof AiInsightsError) {
      if (error.statusCode === 429) req.log.info('AI insight request rate-limited');
      else req.log.warn({ statusCode: error.statusCode }, 'AI insight generation unavailable');
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    req.log.error('Unexpected AI insight handler failure');
    res.status(503).json({
      error: 'AI insights are unavailable right now. Rule-based career guidance is still available.',
    });
  }
});

export default router;
