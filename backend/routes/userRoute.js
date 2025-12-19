import express from "express";
import {
    getAllUsers,
    getUserById,
    deleteUser,
    getMyProfile,
    updateMyProfile,
} from "../controllers/userController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// SELF PROFILE (ALL USERS) 
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

//  ADMIN MANAGEMENT 
router.get("/", protect, authorize("ADMIN"), getAllUsers);
router.get("/:id", protect, authorize("ADMIN"), getUserById);
router.delete("/:id", protect, authorize("ADMIN"), deleteUser);

export default router;
