import { Router } from "express";
// import userRouter from "./userRouter.js";
import healthRouter from "./HealthRouter.js";
import dataPreparationRouter from "./DataPreparationRouter.js";
import userRouter from "./UserRouter.js";

const router = Router();

// router.use("/user", userRouter);
router.use(healthRouter);
router.use(dataPreparationRouter);
router.use(userRouter);
export default router;
