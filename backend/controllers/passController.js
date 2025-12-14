import Pass from "../models/passModel.js";
import CheckLog from "../models/CheckLogModel.js";
import Appointment from "../models/appointmentModel.js";
import Visitor from "../models/visitorModel.js";
import { randomBytes } from "crypto";

const generateToken = () => randomBytes(16).toString("hex");

// ISSUE PASS (Only after appointment is approved)

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

        // 🔥 FIX: Update visitor with new passToken
        await Visitor.findByIdAndUpdate(
            appointment.visitorId._id,
            { passToken: token }
        );

        res.status(201).json({
            success: true,
            message: "Pass issued successfully",
            data: pass
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// SCAN PASS (QR Scan)
export const scanPass = async (req, res) => {
    try {
        const { token } = req.params;

        const pass = await Pass.findOne({ token })
            .populate("visitorId")
            .populate("appointmentId");

        if (!pass) {
            return res.status(404).json({ success: false, message: "Invalid pass" });
        }

        // ❌ Block reuse
        if (pass.status === "expired") {
            return res.status(400).json({
                success: false,
                message: "Pass has expired. Cannot be reused."
            });
        }

        const visitor = await Visitor.findById(pass.visitorId._id);

        // --------------------------------------------------
        // FIRST SCAN → CHECK-IN
        // --------------------------------------------------
        if (!visitor.isInside && pass.status === "issued") {

            visitor.isInside = true;
            visitor.entryTime = new Date();
            visitor.exitTime = null;
            await visitor.save();

            pass.status = "used";
            await pass.save();

            const log = await CheckLog.create({
                visitorId: visitor._id,
                passId: pass._id,
                appointmentId: pass.appointmentId,
                action: "check-in",
                doneBy: "security-auto"
            });

            return res.json({
                success: true,
                message: "Check-in successful",
                data: { pass, visitor, log }
            });
        }

        // --------------------------------------------------
        // SECOND SCAN → CHECK-OUT + EXPIRE
        // --------------------------------------------------
        if (visitor.isInside && pass.status === "used") {

            visitor.isInside = false;
            visitor.exitTime = new Date();
            await visitor.save();

            pass.status = "expired";
            await pass.save();

            const log = await CheckLog.create({
                visitorId: visitor._id,
                passId: pass._id,
                appointmentId: pass.appointmentId,
                action: "check-out",
                doneBy: "security-auto"
            });

            return res.json({
                success: true,
                message: "Check-out successful. Pass expired.",
                data: { pass, visitor, log }
            });
        }

        // --------------------------------------------------
        // INVALID STATE
        // --------------------------------------------------
        return res.status(400).json({
            success: false,
            message: "Invalid scan state"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL PASSES

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

// UPDATE PASS STATUS (active, expired, etc.)

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
