import Visitor from "../models/visitorModel.js";
import Appointment from "../models/appointmentModel.js";

//  REGISTER VISITOR + AUTO-CREATE APPOINTMENT

export const registerVisitor = async (req, res) => {
    try {
        // 1️⃣ Create visitor (ONLY identity fields)
        const visitor = await Visitor.create({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email
        });

        // 2️⃣ Create appointment (visit-specific data)
        const appointment = await Appointment.create({
            visitorId: visitor._id,
            purpose: req.body.purpose,
            hostName: req.body.whomToMeet,
            date: req.body.date || new Date(),
            status: "pending"
        });

        res.status(201).json({
            success: true,
            message: "Visitor registered and appointment created (PENDING)",
            data: {
                visitor,
                appointment
            }
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}



//  GET VISITOR DIGITAL PASS (via passToken)
//  Only works AFTER pass is issued

export const getVisitorPass = async (req, res) => {
    try {
        const visitor = await Visitor.findOne({
            passToken: req.params.token
        }).populate("appointmentId");

        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        res.json({
            success: true,
            data: {
                name: visitor.name,
                phone: visitor.phone,
                email: visitor.email,
                purpose: visitor.purpose,
                whomToMeet: visitor.whomToMeet,
                token: visitor.passToken,

                appointmentId: visitor.appointmentId?._id || null,
                appointmentStatus: visitor.appointmentId?.status || "unknown"
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


//  GET ALL VISITORS (Admin)

export const getAllVisitors = async (req, res) => {
    try {
        const visitors = await Visitor.find();

        res.json({
            success: true,
            data: visitors
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
