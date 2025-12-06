import Visitor from "../models/visitorModel.js";
import { randomBytes } from "crypto";

// Generate unique token for pass
const generateToken = () => randomBytes(16).toString("hex");


//  Register Visitor

export const registerVisitor = async (req, res) => {
    try {
        const token = generateToken();

        const visitor = await Visitor.create({
            ...req.body,
            passToken: token
        });

        res.status(201).json({
            success: true,
            message: "Visitor registered successfully",
            passToken: token,
            data: visitor
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


//  Get Visitor Digital Pass

export const getVisitorPass = async (req, res) => {
    try {
        const visitor = await Visitor.findOne({ passToken: req.params.token });

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
                token: visitor.passToken
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//  Get All Visitors (Admin)

export const getAllVisitors = async (req, res) => {
    try {
        const visitors = await Visitor.find();
        res.json({ success: true, data: visitors });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
