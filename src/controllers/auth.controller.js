import JWT from "jsonwebtoken";

import config from "../config/index.js";
import User from "../models/user.model.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import sendMail from "../utils/sendMail.js";

export const cookieOptions = {
  expires: new Date(Date.now() + 30 * 60 * 1000),
  httpOnly: true,
  sameSite: "None",
  secure: true,
};
const generateActivationCode = () => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  return activationCode;
};

export const register = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log("EMAIL", email);

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide required fields " });
  }

  let user = await User.findOne({ email });

  if (!user) {
    const activationCode = generateActivationCode();
    user = await User.create({ email, otp: parseInt(activationCode) });
  } else {
    const activationCode = generateActivationCode();
    user.otp = parseInt(activationCode);
    await user.save();
  }

  await sendMail({
    email,
    otp: user.otp,
  });

  res.status(200).json({
    success: true,
    message: `Check your email ${email} to activate your account`,
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new CustomError("Please fill all the fields", 400);
  }
  const user = await User.findOne({ email });
  console.log("USER", user);
  if (parseInt(otp) !== user.otp) {
    throw new CustomError("Invalid OTP", 400);
  }

  const accessToken = user.getJwtAccessToken();
  const refreshToken = user.getJwtRefreshToken();
  console.log("A", accessToken, refreshToken);

  res.cookie("refresh_token", refreshToken, {
    expires: new Date(Date.now() + 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.cookie("access_token", accessToken, cookieOptions);
  res.status(200).json({ success: true, user });
});

/**Refresh Token */
export const refresh = asyncHandler(async (req, res) => {
  const refresh_token = req.cookies.refresh_token;
  console.log("REFRESH ", refresh_token);
  const decoded = JWT.verify(refresh_token, config.REFRESH_TOKEN);
  if (!decoded) {
    res.status(400).json({ success: false, message: "Couldn't refreshToken" });
  }
  const id = decoded._id;
  const user = await User.findById(id);
  if (!user) {
    throw new CustomError("Couldn't referesh token", 400);
  }
  const accessToken = user.getJwtAccessToken();

  res.cookie("access_token", accessToken, cookieOptions);
  res.status(200).json({ accessToken });
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("refresh_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "None",
    secure: true,
    // domain: "https://frontend-quizzie.vercel.app",
  });
  res.cookie("access_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});
