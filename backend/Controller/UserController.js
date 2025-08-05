import User from "../Model/User.model.js";
import { getToken } from "../Util/JwtUtil.js";
import bcrypt from "bcryptjs";


export const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('signup controller ',name)

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isOnline: true,
      profilePic: profilePic || undefined, // Only assign if available
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
    res.status(500).json({ success: false, message: error.message });
  }
};


export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
     console.log('Lgin controller ',email)


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
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
export const Update = async (req, res) => {
  try {
    const decoded = req.user;
    const {userId} = decoded;
    const { name, bio, profilePic } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio, profilePic },
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
    console.log(user._id);
    if (!user || !user._id) return res.json({ success: false });

    await User.findByIdAndUpdate(user._id, { isOnline: false });

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
};
