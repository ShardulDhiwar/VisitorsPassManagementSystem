import Appointment from "../models/appointmentModel.js";
import Visitor from "../models/visitorModel.js";

// Create Appointment (Invite)
export const createAppointment = async (req, res) => {
    try {
        const { visitorId, purpose, date, hostId, hostName } = req.body;

        const visitor = await Visitor.findById(visitorId);
        if (!visitor) {
            return res.status(404).json({ success: false, message: "Visitor not found" });
        }

        const appointment = await Appointment.create({
            visitorId,
            purpose,
            date,
            hostId,
            hostName
        });

        res.status(201).json({
            success: true,
            message: "Appointment created",
            data: appointment
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get Appointments (optional filter by hostId)
export const getAppointments = async (req, res) => {
    try {
        const { hostId } = req.query;
        const filter = hostId ? { hostId } : {};

        const list = await Appointment.find(filter).populate("visitorId");

        res.json({ success: true, data: list });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Status (Approve / Reject)
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const updated = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json({
            success: true,
            message: `Appointment ${status}`,
            data: updated
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get All Appointments (Admin)
export const getAllAppointments = async (req, res) => {
    try {
        const list = await Appointment.find().populate("visitorId");
        res.json({ success: true, data: list });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
