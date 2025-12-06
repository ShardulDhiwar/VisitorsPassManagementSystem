import express from "express";
import {
    registerVisitor,
    getVisitorPass,
    getAllVisitors
} from "../controllers/visitorController.js";

const router = express.Router();

// POST /api/visitors/register
router.post("/register", registerVisitor);

// GET /api/visitors/my-pass/:token
router.get("/my-pass/:token", getVisitorPass);

// GET /api/visitors
router.get("/", getAllVisitors);

export default router;
