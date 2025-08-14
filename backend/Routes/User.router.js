import express from 'express'
import {forgetPassword, getUser, Login, Logout, resetPassword, Signup, Update, verifyotp } from '../Controller/UserController.js';
import { protectedRoute } from '../middlewares/ProctectRoute.js';
import {upload} from '../middlewares/multer.js';


const UserRouter = express.Router();



UserRouter.post('/user/Signup',upload.single('profilePic'),Signup);
UserRouter.post("/user/Login",Login);
UserRouter.put("/user/update", protectedRoute, upload.single("profilePic"), Update);
UserRouter.post("/user/Logout",protectedRoute,Logout);
UserRouter.get("/user/users",protectedRoute,getUser);
UserRouter.post("/user/forgotpassword",forgetPassword);
UserRouter.post("/user/verify-otp",verifyotp);
UserRouter.post("/user/reset-password",resetPassword);
// UserRouter.post("/send",send);


export default UserRouter;