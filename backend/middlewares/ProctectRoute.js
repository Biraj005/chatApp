import { verifyToken } from "../Util/JwtUtil.js";
export const protectedRoute = async (req, res, next) => {
    const authHeader = req.headers.authorization;
 
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.json({ success: false, message: "Token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
  
    console.log(token);

    try {
        const decoded = verifyToken(token);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.json({ success: false, message: "Invalid or expired token" });
    }
};
