import express from "express";
import { checkIn, checkOut, getAllCheckLogs } from "../controllers/checkController.js";

const router = express.Router();

router.post("/check-in", checkIn);
router.post("/check-out", checkOut);
router.get("/logs", getAllCheckLogs);

export default router;
