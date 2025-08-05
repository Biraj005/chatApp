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
        console.log('verified token---------------',decoded);
        req.user = decoded; 
        next();
    } catch (error) {
        console.log(error.message,'eroor-------------->')
        return res.json({ success: false, message: "Invalid or expired token" });
    }
};
