import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
    // visitor data
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
//   Emp data 
    // purpose: { type: String, required: true },
    // whomToMeet: { type: String, required: true },

    // data relaed to other db

    // Pass token will be added ONLY after appointment approval
    passToken: { type: String, unique: true, sparse: true, default: null },
    
    // Added: So we can link visitor → appointment
    // appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },

    // For check-in / check-out
    entryTime: { type: Date, default: null },
    exitTime: { type: Date, default: null },
    isInside: { type: Boolean, default: false },

}, { timestamps: true });

export default mongoose.model("Visitor", visitorSchema);
