import { Router, type IRouter } from "express";
import healthRouter from "./health";
import marketSignalsRouter from "./market-signals";
import aiInsightsRouter from "./ai-insights";

const router: IRouter = Router();

router.use(healthRouter);
router.use(marketSignalsRouter);
router.use(aiInsightsRouter);

export default router;
