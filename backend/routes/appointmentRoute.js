// import express from "express";
// import { protect } from "../middlewares/authMiddleware.js";
// import requireRole from "../middlewares/roleMiddleware.js";
// import { createAppointment, getAllAppointments, getAppointmentByHost, getAppointmentByVisitor, updateAppointmentStatus } from "../controllers/appointmentController.js";


// const router = express.Router();

// // Create invitation
// router.post("/invite", protect,
//     requireRole("ADMIN", "EMPLOYEE"), createAppointment);

// // Get appointments (filter by hostId)
// router.get("/", getAppointmentByHost);

// // Get appointments by visitor
// router.get("/visitor/:visitorId", getAppointmentByVisitor);

// // Admin: get all (must come BEFORE dynamic routes)
// router.get("/all", getAllAppointments);

// // Update status (approve/reject)
// router.put("/:id/status", protect,
//     requireRole("ADMIN", "EMPLOYEE"), updateAppointmentStatus);

// export default router;


import express from "express";
import {
    createAppointment,
    getAppointmentByHost,
    getAppointmentByVisitor,
    getAllAppointments,
    updateAppointmentStatus,
} from "../controllers/appointmentController.js";

import { protect } from "../middlewares/authMiddleware.js";
import requireRole from "../middlewares/roleMiddleware.js";

const router = express.Router();

/**
 * EMPLOYEE → Create appointment
 */
router.post(
    "/invite",
    protect,
    requireRole("ADMIN","EMPLOYEE"),
    createAppointment
);

/**
 * EMPLOYEE → Get only OWN appointments
 * ADMIN → Get ALL appointments
 */
router.get(
    "/",
    protect,
    requireRole("ADMIN", "EMPLOYEE"),
    getAppointmentByHost
);

/**
 * Get appointments by visitor (Admin / Security use)
 */
router.get(
    "/visitor/:visitorId",
    protect,
    requireRole("ADMIN", "SECURITY"),
    getAppointmentByVisitor
);

/**
 * ADMIN ONLY → Get all appointments
 */
router.get(
    "/all",
    protect,
    requireRole("ADMIN"),
    getAllAppointments
);

/**
 * ADMIN + EMPLOYEE → Approve / Reject
 */
router.put(
    "/:id/status",
    protect,
    requireRole("ADMIN", "EMPLOYEE"),
    updateAppointmentStatus
);

export default router;

