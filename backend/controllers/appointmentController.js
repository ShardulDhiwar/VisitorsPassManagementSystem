import Appointment from "../models/appointmentModel.js";


// Create Invitation

export const createAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.create(req.body);

        res.status(201).json({
            success: true,
            message: "Appointment request created",
            data: appointment
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// Get Appointments (Filter by hostId)

export const getAppointments = async (req, res) => {
    try {
        const { hostId } = req.query;
        const filter = hostId ? { hostId } : {};

        const list = await Appointment.find(filter);

        res.json({ success: true, data: list });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Update Status (Approve/Reject)

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
        const list = await Appointment.find();
        res.json({ success: true, data: list });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
