import JWT from "jsonwebtoken";

import User from "../models/user.model.js";

import config from "../config/index.js";
import CustomError from "../utils/CustomError.js";
import asyncHandler from "../services/asyncHandler.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refresh_token || req.body.accessToken;

  if (!token) {
    return res.status(400).json({
      success: true,
      message: "Not authorized to access this resource ",
    });
  }

  try {
    const decodedJwtPayload = JWT.verify(token, config.REFRESH_TOKEN);
    const user = await User.findById(decodedJwtPayload._id);
    if (!user) {
      return res.status(400).json({
        success: true,
        message: "User not found through this token",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    throw new CustomError("Not authorized to access this resource ", 401);
  }
});
