import CheckLog from "../models/CheckLogModel.js";
import Pass from "../models/passModel.js";
import Visitor from "../models/visitorModel.js";

// CHECK-IN
export const checkIn = async (req, res) => {
    try {
        const { token, doneBy = "security-manual" } = req.body;

        const pass = await Pass.findOne({ token })
            .populate("visitorId")
            .populate("appointmentId");

        if (!pass)
            return res.status(404).json({ success: false, message: "Invalid pass token" });

        if (pass.status !== "issued")
            return res.status(400).json({
                success: false,
                message: "Pass already used or expired"
            });

        // Visitor enters
        await Visitor.findByIdAndUpdate(pass.visitorId._id, {
            isInside: true,
            entryTime: new Date()
        });

        // Update pass
        pass.status = "used";
        await pass.save();

        // Log
        await CheckLog.create({
            visitorId: pass.visitorId._id,
            passId: pass._id,
            appointmentId: pass.appointmentId._id,
            action: "check-in",
            doneBy
        });

        res.json({
            success: true,
            message: "Check-in successful"
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// CHECK-OUT
export const checkOut = async (req, res) => {
    try {
        const token = req.body;
        const doneBy = req.user.name;

        const pass = await Pass.findOne({ token })
            .populate("visitorId")
            .populate("appointmentId");

        if (!pass)
            return res.status(404).json({ success: false, message: "Invalid pass token" });

        if (pass.status !== "used")
            return res.status(400).json({
                success: false,
                message: "Pass is not active or already expired"
            });

        // Visitor exits
        await Visitor.findByIdAndUpdate(pass.visitorId._id, {
            isInside: false,
            exitTime: new Date()
        });

        // Expire pass
        pass.status = "expired";
        await pass.save();

        // Log
        await CheckLog.create({
            visitorId: pass.visitorId._id,
            passId: pass._id,
            appointmentId: pass.appointmentId._id,
            action: "check-out",
            doneBy
        });

        res.json({
            success: true,
            message: "Check-out successful. Pass expired."
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllCheckLogs = async (req, res) => {
    try {
        const logs = await CheckLog.find()
            .populate("visitorId", "name email phone isInside")
            .populate("passId", "token status")
            .populate("appointmentId")
            .sort({ createdAt: -1 }); // latest first

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



