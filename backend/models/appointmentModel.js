import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    visitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visitor",
        required: true
    },

    purpose: { type: String, required: true },
    whomToMeet: { type: String, required: true },

    date: { type: Date, required: true },

    hostId: { type: String, },
    hostName: { type: String },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }

}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
