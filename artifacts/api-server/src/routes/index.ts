import { Router, type IRouter } from "express";
import healthRouter from "./health";
import marketSignalsRouter from "./market-signals";

const router: IRouter = Router();

router.use(healthRouter);
router.use(marketSignalsRouter);

export default router;
