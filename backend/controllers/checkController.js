import CheckLog from "../models/CheckLogModel.js";
import Pass from "../models/passModel.js";
import Visitor from "../models/visitorModel.js";

// CHECK-IN
export const checkIn = async (req, res) => {
    try {
        const { token, doneBy } = req.body;

        const pass = await Pass.findOne({ token })
            .populate("visitorId")
            .populate("appointmentId");

        if (!pass)
            return res.status(404).json({ success: false, message: "Invalid pass token" });

        if (pass.status !== "issued")
            return res.status(400).json({ success: false, message: "Pass already used or revoked" });

        // Mark visitor inside
        await Visitor.findByIdAndUpdate(pass.visitorId._id, { isInside: true });

        // Update pass status
        pass.status = "used";
        await pass.save();

        // Log entry
        await CheckLog.create({
            visitorId: pass.visitorId._id,
            passId: pass._id,
            appointmentId: pass.appointmentId._id,
            action: "check-in",
            doneBy
        });

        const updatedVisitor = await Visitor.findById(pass.visitorId._id);

        res.json({
            success: true,
            message: "Visitor checked in",
            visitor: updatedVisitor
        });


    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// CHECK-OUT
export const checkOut = async (req, res) => {
    try {
        const { token, doneBy } = req.body;

        const pass = await Pass.findOne({ token })
            .populate("visitorId")
            .populate("appointmentId");

        if (!pass)
            return res.status(404).json({ success: false, message: "Invalid pass token" });

        if (!pass.visitorId.isInside)
            return res.status(400).json({ success: false, message: "Visitor is not inside" });

        // Mark visitor outside
        await Visitor.findByIdAndUpdate(pass.visitorId._id, { isInside: false });

        // Log exit
        await CheckLog.create({
            visitorId: pass.visitorId._id,
            passId: pass._id,
            appointmentId: pass.appointmentId._id,
            action: "check-out",
            doneBy
        });

        // Get updated visitor
        const updatedVisitor = await Visitor.findById(pass.visitorId._id);

        res.json({
            success: true,
            message: "Visitor checked out",
            visitor: updatedVisitor
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

