import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import requireRole from "../middlewares/roleMiddleware.js";
import {
    issuePass,
    scanPass,
    getAllPasses,
    updatePassStatus
} from "../controllers/passController.js";

const router = express.Router();

// --------------------------------------------------
// ISSUE PASS (Admin / Reception)
// --------------------------------------------------
router.post(
    "/issue",
    protect,
    requireRole("ADMIN"),
    issuePass
);

// --------------------------------------------------
// SCAN QR PASS (Security)
// --------------------------------------------------
router.get(
    "/scan/:token",
    protect,
    requireRole("SECURITY"),
    scanPass
);

// --------------------------------------------------
// GET ALL PASSES (Admin / Security)
// --------------------------------------------------
router.get(
    "/",
    protect,
    requireRole("ADMIN", "SECURITY"),
    getAllPasses
);

// --------------------------------------------------
// UPDATE PASS STATUS (TOKEN BASED ✅ FIXED)
// Token is now in the URL path instead of request body
// --------------------------------------------------
router.put(
    "/:token/status",
    protect,
    requireRole("ADMIN", "SECURITY"),
    updatePassStatus
);

export default router;