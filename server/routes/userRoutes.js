import express from "express";
import { getuserdata, loginUser, registerUser } from "../controllers/usercontroller.js";
import { protect } from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.post('/register',registerUser);

userRouter.post('/login',loginUser);

userRouter.get('/data',protect,getuserdata);

export default userRouter;
