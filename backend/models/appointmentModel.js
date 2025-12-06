import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    visitorName: { type: String, required: true },
    visitorEmail: { type: String },
    visitorPhone: { type: String, required: true },

    purpose: { type: String, required: true },
    date: { type: Date, required: true },

    hostId: { type: String, required: true },   // Employee who invited
    hostName: { type: String },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }

}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
