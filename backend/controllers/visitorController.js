import Visitor from "../models/visitorModel.js";

export const createVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.create(req.body);
        res.status(201).json({
            success: true,
            message: "Visitor created successfully",
            data: visitor,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getAllVisitors = async (req, res) => {
    try {
        const visitors = await Visitor.find();
        res.json({ success: true, data: visitors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
