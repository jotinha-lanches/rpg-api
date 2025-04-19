import express from "express";
const router = express.Router();
import batalhaRouter from "./batalha.routes.js";
import statusRouter from "./status.routes.js";

router.use(statusRouter);
router.use("/batalha", batalhaRouter);

export default router;
