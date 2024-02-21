import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";

import internshipRoute from "./routes/internShip.route.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/auth", userRouter);
app.use("/app", internshipRoute);

app.all("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
