import User from "../models/userModel.js";


//  ADMIN : GET ALL USERS
 
export const getAllUsers = async (req, res) => {
    const users = await User.find().select("-password");
    res.json({ success: true, data: users });
};


//   ADMIN : GET USER BY ID
 
export const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, data: user });
};

//  ADMIN : DELETE USER
 
export const deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, message: "User deleted successfully" });
};


// USER : GET OWN PROFILE
 
export const getMyProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, data: user });
};


//   USER : UPDATE OWN PROFILE
 
export const updateMyProfile = async (req, res) => {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({ success: true, message: "Profile updated" });
};
