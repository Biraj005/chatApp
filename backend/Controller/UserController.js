import crypto from "crypto";
import User from "../Model/User.model.js";
import { getToken } from "../Util/JwtUtil.js";
import cloudinary from "../Util/cloudinary.js";
import bcrypt from "bcryptjs";
import transporter from "../Util/Nodmailer.js";
import fs from "fs";

export const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    let profilePicUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pics",
      });
      profilePicUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isOnline: true,
      profilePic: profilePicUrl, 
    });

    await newUser.save();

    const token = getToken(newUser._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isOnline: newUser.isOnline,
        profilePic: newUser.profilePic,
        bio: newUser.bio, 
      },
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    user.isOnline = true;
    await user.save();

    const token = getToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isOnline: user.isOnline,
        profilePic: user.profilePic,
        bio: user.bio,
      },
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const Update = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, bio } = req.body;

    let profilePicUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pics",
      });
      profilePicUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    if (!profilePicUrl && !name && !bio) {
      return res.json({
        success: true,
        message: "No data provided to update",
      });
    }

    const newData = {};
    if (profilePicUrl) newData.profilePic = profilePicUrl;
    if (bio) newData.bio = bio;
    if (name) newData.name = name;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: newData },
      { new: true }
    ).select("-password");

    return res.json({
      success: true,
      message: "User data updated",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const Logout = async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID not found in token" });
    }

    await User.findByIdAndUpdate(userId, { isOnline: false });

    res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.user;

    const users = await User.find({ _id: { $ne: userId } }).select("-password");
    res.json({ success: true, message: "Users found", users });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "No user found with that email" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetOtp = hashedOtp;
    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.resetOtp || !user.resetOtpExpiry) {
        return res.status(400).json({ success: false, message: "Invalid request or OTP not generated" });
    }
    
    if (user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (user.resetOtp !== hashedOtp) {
      return res.status(400).json({ success: false, message: "Wrong OTP" });
    }

    user.resetOtp = null; 
    user.resetOtpExpiry = null;
    await user.save();

    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password, email } = req.body;
    if (!password || !email) {
        return res.status(400).json({ success: false, message: "Email and new password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Password has been updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};