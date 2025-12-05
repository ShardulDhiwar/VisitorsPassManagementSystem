import mongoose from "mongoose";

const DBConnection = async () => {
    const DB_URL = process.env.MONGO_URI;

    try {
        await mongoose.connect(DB_URL);    
        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.error("Connection Error:", error.message);
    }
};

export default DBConnection;