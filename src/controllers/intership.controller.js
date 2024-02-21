import axios from "axios";
import cheerio from "cheerio";

import asyncHandler from "../services/asyncHandler.js";
import User from "../models/user.model.js";

export const getAllInterShip = asyncHandler(async (req, res) => {
  const URL =
    "https://internshala.com/internships/computer-science-internship/";
  try {
    const response = await axios.get(URL);
    const html = response.data;
    const internships = [];
    const $ = cheerio.load(html);
    $("div.container-fluid.individual_internship").each((index, element) => {
      const internship = {};
      internship.id = $(element).attr("id");
      internship.title = $(element).find("h3.heading_4_5 a").text().trim();
      internship.company = $(element).find("div.heading_6 a").text().trim();
      internship.location = $(element)
        .find("div#location_names span a")
        .text()
        .trim();
      internship.startDate = $(element)
        .find("div#start-date-first .item_body")
        .text()
        .trim();
      internship.duration = $(element)
        .find(
          "div.other_detail_item_row .other_detail_item:nth-child(2) .item_body"
        )
        .text()
        .trim();
      internship.stipend = $(element)
        .find("div.other_detail_item_row .stipend_container .item_body")
        .text()
        .trim();
      internship.posted = $(element)
        .find("div.tags_container_outer .status.status-info")
        .text()
        .trim();
      internship.logo = $(element).find("div.internship_logo img").attr("src"); // Get company logo URL
      internships.push(internship);
    });
    res.json({ data: internships });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
export const getAllJobs = asyncHandler(async (req, res) => {
  const URL = "https://internshala.com/jobs/work-from-home";
  try {
    const response = await axios.get(URL);
    const html = response.data;
    const jobs = [];
    const $ = cheerio.load(html);
    $("div.container-fluid.individual_internship.visibilityTrackerItem").each(
      (index, element) => {
        const job = {};
        job.id = $(element).attr("id");
        job.title = $(element).find("h3.heading_4_5 a").text().trim();
        job.company = $(element).find("div.heading_6 a").text().trim();
        job.location = $(element).find("p#location_names span a").text().trim();
        job.startDate = $(element)
          .find("div#start-date-first .item_body")
          .text()
          .trim();
        job.salary = $(element)
          .find("div.other_detail_item.salary_container .item_body.salary")
          .text()
          .trim();
        job.experience = $(element)
          .find("div.other_detail_item.job-experience-item .item_body")
          .text()
          .trim();
        job.logo = $(element).find("div.internship_logo img").attr("src");
        jobs.push(job);
      }
    );
    res.json({ data: jobs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const calculatePoints = (oldProfile, newProfile) => {
  let totalPointsEarned = 0;

  // Personal Details
  if (!oldProfile.personalDetails.name && newProfile.personalDetails.name)
    totalPointsEarned += 1;
  if (!oldProfile.personalDetails.mobile && newProfile.personalDetails.mobile)
    totalPointsEarned += 15;
  if (
    !oldProfile.personalDetails.profilePic &&
    newProfile.personalDetails.profilePic
  )
    totalPointsEarned += 5;
  if (
    !oldProfile.personalDetails.linkedInLink &&
    newProfile.personalDetails.linkedInLink
  )
    totalPointsEarned += 3;
  if (
    !oldProfile.personalDetails.githubLink &&
    newProfile.personalDetails.githubLink
  )
    totalPointsEarned += 5;
  if (!oldProfile.personalDetails.resume && newProfile.personalDetails.resume)
    totalPointsEarned += 20;

  // Education Details
  if (
    !oldProfile.educationDetails.schoolOrCollegeName &&
    newProfile.educationDetails.schoolOrCollegeName
  )
    totalPointsEarned += 5;
  if (
    !oldProfile.educationDetails.startDate &&
    newProfile.educationDetails.startDate
  )
    totalPointsEarned += 2;
  if (
    !oldProfile.educationDetails.endDate &&
    newProfile.educationDetails.endDate
  )
    totalPointsEarned += 2;

  // Project Details
  if (
    !oldProfile.projectDetails.projectName &&
    newProfile.projectDetails.projectName
  )
    totalPointsEarned += 5;
  if (
    !oldProfile.projectDetails.projectDescription &&
    newProfile.projectDetails.projectDescription
  )
    totalPointsEarned += 6;
  if (
    !oldProfile.projectDetails.soloOrGroup &&
    newProfile.projectDetails.soloOrGroup
  )
    totalPointsEarned += 4;
  if (
    !oldProfile.projectDetails.projectLink &&
    newProfile.projectDetails.projectLink
  )
    totalPointsEarned += 10;

  // Experience Details
  newProfile.experienceDetails.forEach((newExperience, index) => {
    const oldExperience = oldProfile.experienceDetails[index];
    if (!oldExperience?.type && newExperience.type) totalPointsEarned += 5;
    if (!oldExperience?.companyName && newExperience.companyName)
      totalPointsEarned += 10;
    if (!oldExperience?.companyWebsite && newExperience.companyWebsite)
      totalPointsEarned += 10;
    if (!oldExperience?.role && newExperience.role) totalPointsEarned += 8;
    if (!oldExperience?.startDate && newExperience.startDate)
      totalPointsEarned += 2;
    if (!oldExperience?.endDate && newExperience.endDate)
      totalPointsEarned += 2;
    if (!oldExperience?.coverLetter && newExperience.coverLetter)
      totalPointsEarned += 20;
  });

  return totalPointsEarned;
};

export const updateCoinBalance = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const totalPointsEarned = calculatePoints(
      req.user.profile,
      req.body.profile
    );

    user.coins += totalPointsEarned;
    user.profile = req.body.profile;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Coin balance updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export const getCoin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, coins: user.coins });
});

///get profile to set the value
//updateCoin by apply and reduce 50 coin(if the value more then 50)

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({ user });
});

export const apply = asyncHandler(async (req, res) => {
  const { company, title } = req.body;

  const user = await User.findById(req.user._id);

  if (user.coins >= 50) {
    user.coins -= 50;

    user.applied.push({ name: company, role: title });

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Job application successful" });
  } else {
    res.status(400).json({
      success: false,
      message: "Oops! You don't have sufficient balance",
    });
  }
});

export const appliedIntership = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({ applied: user.applied });
});
