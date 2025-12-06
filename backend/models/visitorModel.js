import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    purpose: { type: String, required: true },
    whomToMeet: { type: String, required: true },

    passToken: { type: String, unique: true },

    entryTime: { type: Date },
    exitTime: { type: Date },
    isInside: { type: Boolean, default: false },

}, { timestamps: true });

export default mongoose.model("Visitor", visitorSchema);
