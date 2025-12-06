import express from "express";
import { createAppointment, getAllAppointments, getAppointments, updateAppointmentStatus } from "../controllers/appointmentController.js";


const router = express.Router();

// Create invitation
router.post("/invite", createAppointment);

// Get appointments (filter by hostId)
router.get("/", getAppointments);

// Update status (approve/reject)
router.put("/:id/status", updateAppointmentStatus);

// Admin: get all
router.get("/all", getAllAppointments);

export default router;
