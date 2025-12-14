import Appointment from "../models/appointmentModel.js";
import Visitor from "../models/visitorModel.js";
import Pass from "../models/passModel.js";
import { randomBytes } from "crypto";

const generateToken = () => randomBytes(16).toString("hex");

// CREATE APPOINTMENT (INVITE)

export const createAppointment = async (req, res) => {
    try {
        const {
            visitorId,
            name,
            phone,
            email,
            purpose,
            whomToMeet,
            date,
            hostId,
            hostName
        } = req.body;

        let visitor;

        // -----------------------------------------------------
        // IF visitorId provided → use existing visitor
        // -----------------------------------------------------
        if (visitorId) {
            visitor = await Visitor.findById(visitorId);

            if (!visitor) {
                return res.status(404).json({
                    success: false,
                    message: "Visitor not found"
                });
            }
        }

        // -----------------------------------------------------
        // IF NO visitorId → auto-create NEW visitor
        // -----------------------------------------------------
        else {
            visitor = await Visitor.create({
                name,
                phone,
                email,
                purpose,
                whomToMeet
            });
        }

        // -----------------------------------------------------
        // Create appointment (pending)
        // -----------------------------------------------------
        const appointment = await Appointment.create({
            visitorId: visitor._id,
            purpose,
            whomToMeet,
            date,
            hostId,
            hostName,
            status: "pending"
        });

        // Link appointment to visitor for future use
        visitor.appointmentId = appointment._id;
        await visitor.save();

        res.status(201).json({
            success: true,
            message: "Appointment created (Visitor handled automatically)",
            data: {
                visitor,
                appointment
            }
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// GET ALL APPOINTMENTS (Optional filter by hostId)

export const getAppointmentByHost = async (req, res) => {
    try {
        const { hostId } = req.query;

        const filter = hostId ? { hostId } : {};

        const list = await Appointment.find(filter)
            .populate("visitorId");

        res.json({ success: true, data: list });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET APPOINTMENTS BY VISITOR ID

export const getAppointmentByVisitor = async (req, res) => {
    try {
        const visitorId = req.params.visitorId;

        const list = await Appointment.find({ visitorId })
            .populate("visitorId");

        res.json({ success: true, data: list });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// UPDATE STATUS → APPROVE / REJECT

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const appointment = await Appointment.findById(req.params.id)
            .populate("visitorId");

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Update appointment status
        appointment.status = status;
        await appointment.save();

        // AUTO-ISSUE PASS IF APPROVED
        if (status === "approved") {
            const token = generateToken();

            // Create a pass entry
            const pass = await Pass.create({
                visitorId: appointment.visitorId._id,
                appointmentId: appointment._id,
                token,
                issuedBy: "system-auto"
            });

            // Update visitor with passToken
            await Visitor.findByIdAndUpdate(appointment.visitorId._id, {
                passToken: token
            });

            return res.json({
                success: true,
                message: "Appointment approved. Pass issued automatically.",
                appointment,
                pass
            });
        }

        // If rejected
        res.json({
            success: true,
            message: `Appointment ${status}`,
            data: appointment
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};




// GET ALL (ADMIN)

export const getAllAppointments = async (req, res) => {
    try {
        const list = await Appointment.find().populate("visitorId");

        res.json({ success: true, data: list });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
