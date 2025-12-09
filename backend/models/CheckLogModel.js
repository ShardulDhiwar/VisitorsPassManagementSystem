import mongoose from "mongoose";

const checkLogSchema = new mongoose.Schema({

    visitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visitor",
        required: true
    },

    passId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pass",
        required: true
    },

    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true
    },

    action: {
        type: String,
        enum: ["check-in", "check-out"],
        required: true
    },

    timestamp: { type: Date, default: Date.now },
    doneBy: { type: String }   // security guard ID/name

}, { timestamps: true });

export default mongoose.model("CheckLog", checkLogSchema);
