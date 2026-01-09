// import Appointment from "../models/appointmentModel.js";
// import Visitor from "../models/visitorModel.js";

// /**
//  * EMPLOYEE → Create appointment
//  */
// export const createAppointment = async (req, res) => {
//     try {
//         const {
//             name,
//             phone,
//             email,
//             purpose,
//             whomToMeet,
//             date,
//         } = req.body;

//         if (!name || !phone || !email || !purpose || !date) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All required fields must be provided",
//             });
//         }

//         // 🔹 Create or reuse visitor
//         let visitor = await Visitor.findOne({ email });

//         if (!visitor) {
//             visitor = await Visitor.create({
//                 name,
//                 phone,
//                 email,
//             });
//         }

//         const appointment = await Appointment.create({
//             visitorId: visitor._id,
//             purpose,
//             whomToMeet,
//             date,
//             hostId: req.user._id,     // 🔐 from token
//             hostName: req.user.name,  // 🔐 from token
//             status: "pending",
//         });

//         res.status(201).json({
//             success: true,
//             data: appointment,
//         });
//     } catch (error) {
//         console.error("Create appointment error:", error);
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// /**
//  * EMPLOYEE → only OWN appointments
//  * ADMIN → ALL appointments
//  */
// export const getAppointmentByHost = async (req, res) => {
//     try {
//         let filter = {};

//         if (req.user.role === "EMPLOYEE") {
//             filter.hostId = req.user._id;
//         }

//         const list = await Appointment.find(filter)
//             .populate("visitorId")
//             .sort({ createdAt: -1 });

//         res.status(200).json({
//             success: true,
//             data: list,
//         });
//     } catch (error) {
//         console.error("Get appointments error:", error);
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// /**
//  * Get appointments for a visitor
//  */
// export const getAppointmentByVisitor = async (req, res) => {
//     try {
//         const { visitorId } = req.params;

//         const list = await Appointment.find({ visitorId })
//             .populate("visitorId")
//             .sort({ createdAt: -1 });

//         res.status(200).json({
//             success: true,
//             data: list,
//         });
//     } catch (error) {
//         console.error("Get visitor appointments error:", error);
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// /**
//  * ADMIN ONLY → Get all appointments
//  */
// export const getAllAppointments = async (req, res) => {
//     try {
//         const list = await Appointment.find()
//             .populate("visitorId")
//             .sort({ createdAt: -1 });

//         res.status(200).json({
//             success: true,
//             data: list,
//         });
//     } catch (error) {
//         console.error("Admin get all appointments error:", error);
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// /**
//  * ADMIN + EMPLOYEE → Approve / Reject
//  */
// export const updateAppointmentStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;

//         if (!status) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Status is required",
//             });
//         }

//         const appointment = await Appointment.findById(id);

//         if (!appointment) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Appointment not found",
//             });
//         }

//         // 🔐 Employee can update ONLY own appointments
//         if (
//             req.user.role === "EMPLOYEE" &&
//             appointment.hostId.toString() !== req.user._id.toString()
//         ) {
//             return res.status(403).json({
//                 success: false,
//                 message: "You can update only your own appointments",
//             });
//         }

//         appointment.status = status.toLowerCase();
//         await appointment.save();

//         res.status(200).json({
//             success: true,
//             data: appointment,
//         });
//     } catch (error) {
//         console.error("Update appointment status error:", error);
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

import Appointment from "../models/appointmentModel.js";
import Visitor from "../models/visitorModel.js";
import Pass from "../models/passModel.js";
import crypto from "crypto";


/* ======================================================
   EMPLOYEE → Create Appointment
====================================================== */
export const createAppointment = async (req, res) => {
    try {
        const { name, phone, email, purpose, whomToMeet, date } = req.body;

        if (!name || !phone || !email || !purpose || !whomToMeet || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Create or reuse visitor
        let visitor = await Visitor.findOne({ email });
        if (!visitor) {
            visitor = await Visitor.create({ name, phone, email });
        }

        const appointment = await Appointment.create({
            visitorId: visitor._id,
            purpose,
            whomToMeet,
            date,
            hostId: req.user._id,
            hostName: req.user.name,
            status: "pending",
        });

        res.status(201).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        console.error("Create appointment error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ======================================================
   EMPLOYEE → only own appointments
   ADMIN → all appointments
====================================================== */
export const getAppointmentByHost = async (req, res) => {
    try {
        const filter =
            req.user.role === "EMPLOYEE" ? { hostId: req.user._id } : {};

        const list = await Appointment.find(filter)
            .populate("visitorId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: list,
        });
    } catch (error) {
        console.error("Get appointments error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ======================================================
   Get appointments for a visitor
====================================================== */
export const getAppointmentByVisitor = async (req, res) => {
    try {
        const { visitorId } = req.params;
        const list = await Appointment.find({ visitorId })
            .populate("visitorId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: list,
        });
    } catch (error) {
        console.error("Get visitor appointments error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ======================================================
   ADMIN ONLY → Get all appointments
====================================================== */
export const getAllAppointments = async (req, res) => {
    try {
        const list = await Appointment.find()
            .populate("visitorId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: list,
        });
    } catch (error) {
        console.error("Admin get all appointments error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ======================================================
   ADMIN + EMPLOYEE → Approve / Reject Appointment
====================================================== */
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const normalizedStatus = status.toLowerCase();
        if (!["approved", "rejected"].includes(normalizedStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status must be approved or rejected",
            });
        }

        const appointment = await Appointment.findById(id)
            .populate("visitorId");

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        // EMPLOYEE safety check
        if (
            req.user.role === "EMPLOYEE" &&
            appointment.hostId.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        appointment.status = normalizedStatus;
        await appointment.save();

        let pass = null;

        // ✅ If approved → create pass
        if (normalizedStatus === "approved") {
            pass = await Pass.findOne({ appointmentId: appointment._id });

            if (!pass) {
                const token = crypto.randomBytes(16).toString("hex");

                pass = await Pass.create({
                    appointmentId: appointment._id,
                    visitorId: appointment.visitorId._id,
                    token,
                });
            }
        }

        res.status(200).json({
            success: true,
            data: {
                appointment,
                pass, // 👈 frontend will use this for EmailJS
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

