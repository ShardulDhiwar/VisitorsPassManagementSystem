import express from "express";
import { createAppointment, getAllAppointments, getAppointmentByHost, getAppointmentByVisitor, updateAppointmentStatus } from "../controllers/appointmentController.js";


const router = express.Router();

// Create invitation
router.post("/invite", createAppointment);

// Get appointments (filter by hostId)
router.get("/", getAppointmentByHost);

// Get appointments by visitor
router.get("/visitor/:visitorId", getAppointmentByVisitor);

// Admin: get all (must come BEFORE dynamic routes)
router.get("/all", getAllAppointments);

// Update status (approve/reject)
router.put("/:id/status", updateAppointmentStatus);

export default router;

