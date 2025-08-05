import express from 'express'
import { Login, Logout, Signup, Update } from '../controller/usercontroller.js';
import { protectedRoute } from '../middlewares/ProctectRoute.js';
// import { upload } from '../middlewares/multer.js';


const UserRouter = express.Router();



UserRouter.post('/user/Signup',Signup);
UserRouter.post("/user/Login",Login);
UserRouter.put('/user/Update',protectedRoute,Update);
UserRouter.post("/user/Logout",protectedRoute,Logout);

export default UserRouter;