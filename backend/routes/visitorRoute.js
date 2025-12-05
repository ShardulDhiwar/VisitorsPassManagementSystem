import express from "express";
import { createVisitor, getAllVisitors } from "../controllers/visitorController.js";

const router = express.Router();

// POST /api/visitors/create
router.post("/create", createVisitor);

// GET /api/visitors/all
router.get("/all", getAllVisitors);

export default router;
