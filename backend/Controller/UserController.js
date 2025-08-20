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
      return res.json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
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
      profilePic: profilePicUrl || undefined,
    });

    await newUser.save();
 

    const token = getToken(newUser._id);

    res.json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isOnline: newUser.isOnline,
        profilePic: newUser.profilePic,
      },
      token,
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
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
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid email or password" });
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
    return res.json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

export const Update = async (req, res) => {
  try {
    const decoded = req.user;
    const { userId } = decoded;
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
    if (profilePicUrl) newData.profilePicUrl = profilePicUrl;
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
    return res.json({ success: false, message: err.message });
  }
};


export const Logout = async (req, res) => {
  try {
    const { user } = req.body;
    if (!user || !user._id) return res.json({ success: false });

    await User.findByIdAndUpdate(user._id, { isOnline: false });

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.user;

    const users = await User.find({ _id: { $ne: userId } }).select("-password");
    res.json({ success: true, message: "Users found", users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const forgetPassword = async (req, res) => {
  const { email } = req.body;


  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ success: false, message: "No uer found " });
  }
  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  user.resetOtp = hashedOtp;
  user.resetOtpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });
  res.json({ success: true, message: "OTP sent successfully" });
};

export const verifyotp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

      if (user.resetOtp !== hashedOtp) {
      return res.json({ success: false, message: "Wrong OTP" });
    }

   if (user.resetOtpExpiry && user.resetOtpExpiry < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

      user.resetOtpExpiry = null;
      await user.save();

      return res.json({ success: true, message: "OTP verified successfully" });


  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Password is updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
