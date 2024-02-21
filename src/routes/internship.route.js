import { Router } from "express";
import {
  getAllInterShip,
  updateCoinBalance,
  getAllJobs,
  getCoin,
  getProfile,
  apply,
  appliedIntership,
} from "../controllers/intership.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

const internshipRoute = Router();

internshipRoute.get("/get-internships", isLoggedIn, getAllInterShip);
internshipRoute.get("/get-jobs", isLoggedIn, getAllJobs);
internshipRoute.post("/update-coins", isLoggedIn, updateCoinBalance);
internshipRoute.get("/get-coins", isLoggedIn, getCoin);
internshipRoute.get("/get-profile", isLoggedIn, getProfile);
internshipRoute.post("/apply", isLoggedIn, apply);
internshipRoute.get("/applied", isLoggedIn, appliedIntership);

export default internshipRoute;
