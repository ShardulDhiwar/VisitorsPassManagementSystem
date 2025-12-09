import Pass from "../models/passModel.js";
import Appointment from "../models/appointmentModel.js";
import { randomBytes } from "crypto";

const generateToken = () => randomBytes(16).toString("hex");

// Issue Pass (only for approved appointments)
export const issuePass = async (req, res) => {
    try {
        const { appointmentId, issuedBy } = req.body;

        const appointment = await Appointment.findById(appointmentId).populate("visitorId");

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointment.status !== "approved") {
            return res.status(400).json({
                success: false,
                message: "Appointment is not approved. Cannot issue pass."
            });
        }

        const token = generateToken();

        const pass = await Pass.create({
            visitorId: appointment.visitorId._id,
            appointmentId,
            token,
            issuedBy
        });

        res.status(201).json({
            success: true,
            message: "Pass issued successfully",
            data: pass
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Scan pass (QR Scan)
export const scanPass = async (req, res) => {
    try {
        const token = req.params.token;

        const pass = await Pass.findOne({ token })
            .populate("visitorId")
            .populate("appointmentId");

        if (!pass) {
            return res.status(404).json({ success: false, message: "Invalid pass" });
        }

        res.json({ success: true, data: pass });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all passes
export const getAllPasses = async (req, res) => {
    try {
        const list = await Pass.find()
            .populate("visitorId")
            .populate("appointmentId");

        res.json({ success: true, data: list });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update pass status
export const updatePassStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const updated = await Pass.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json({
            success: true,
            message: "Pass status updated",
            data: updated
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
