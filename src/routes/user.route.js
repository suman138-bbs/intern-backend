import { Router } from "express";
import {
  verifyOtp,
  register,
  logout,
  refresh,
} from "../controllers/auth.controller.js";

const userRouter = Router();

userRouter.post("/verify", verifyOtp);
userRouter.post("/register", register);
userRouter.get("/logout", logout);
userRouter.get("/refresh", refresh);

export default userRouter;
