import mongoose from "mongoose";

const passSchema = new mongoose.Schema({

    visitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visitor",
        required: true
    },

    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
    },

    token: { type: String, required: true, unique: true },

    status: {
        type: String,
        enum: ["issued", "used", "revoked", "expired"],
        default: "issued"
    },

    issuedBy: { type: String },
    issueTime: { type: Date, default: Date.now }

}, { timestamps: true });

export default mongoose.model("Pass", passSchema);
