import express from "express";
import requireAuth from "../middlewares/authMiddleware.js";
import requireRole from "../middlewares/roleMiddleware.js";
import {
    issuePass,
    scanPass,
    getAllPasses,
    updatePassStatus
} from "../controllers/passController.js";

const router = express.Router();

// Issue pass
router.post("/issue", issuePass);

// Scan QR Pass
router.get("/scan/:token", requireAuth,
    requireRole("SECURITY"),
    scanPass);

// Get all passes
router.get("/", getAllPasses);

// Update pass status
router.put("/:id/status", updatePassStatus);

export default router;
