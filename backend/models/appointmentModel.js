import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        visitorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Visitor",
            required: true,
        },

        purpose: {
            type: String,
            required: true,
            trim: true,
        },

        whomToMeet: {
            type: String,
            required: true,
            trim: true,
        },

        date: {
            type: Date,
            required: true,
        },

        // 🔐 MUST be ObjectId to match req.user._id
        hostId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        hostName: {
            type: String,
            default: null,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
