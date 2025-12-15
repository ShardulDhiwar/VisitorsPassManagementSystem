import express from "express";
import requireAuth from "../middlewares/authMiddleware.js";
import requireRole from "../middlewares/roleMiddleware.js";
import { createAppointment, getAllAppointments, getAppointmentByHost, getAppointmentByVisitor, updateAppointmentStatus } from "../controllers/appointmentController.js";


const router = express.Router();

// Create invitation
router.post("/invite", requireAuth,
    requireRole("EMPLOYEE"), createAppointment);

// Get appointments (filter by hostId)
router.get("/", getAppointmentByHost);

// Get appointments by visitor
router.get("/visitor/:visitorId", getAppointmentByVisitor);

// Admin: get all (must come BEFORE dynamic routes)
router.get("/all", getAllAppointments);

// Update status (approve/reject)
router.put("/:id/status", requireAuth,
    requireRole("ADMIN", "EMPLOYEE"), updateAppointmentStatus);

export default router;

