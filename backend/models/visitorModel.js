import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    purpose: { type: String, required: true },
    whomToMeet: { type: String, required: true },
    entryTime: { type: Date, default: Date.now },
    exitTime: { type: Date },
    isInside: { type: Boolean, default: true },
});

export default mongoose.model("Visitor", visitorSchema);
