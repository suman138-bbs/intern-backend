import mongoose from "mongoose";

import JWT from "jsonwebtoken";
import config from "../config/index.js";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
  },
  coins: {
    type: Number,
    default: 0,
  },
  applied: [
    {
      name: String,
      role: String,
    },
  ],
  profile: {
    personalDetails: {
      name: {
        type: String,
        default: "",
      },
      mobile: {
        type: String,
        default: "",
      },
      profilePic: {
        type: String,
        default: "",
      },
      linkedInLink: {
        type: String,
        default: "",
      },
      githubLink: {
        type: String,
        default: "",
      },
      resume: {
        type: String,
        default: "",
      },
    },
    educationDetails: {
      type: {
        type: String,
        default: "",
      },
      schoolOrCollegeName: {
        type: String,
        default: "",
      },
      startDate: {
        type: Date,
        default: "",
      },
      endDate: {
        type: Date,
        default: "",
      },
    },
    projectDetails: {
      projectName: {
        type: String,
        default: "",
      },
      projectDescription: {
        type: String,
        default: "",
      },
      soloOrGroup: {
        type: String,
        default: "",
      },
      projectLink: {
        type: String,
        default: "",
      },
    },
    experienceDetails: [
      {
        type: {
          type: String,
          default: "",
        },
        companyName: {
          type: String,
          default: "",
        },
        companyWebsite: {
          type: String,
          default: "",
        },
        role: {
          type: String,
          default: "",
        },
        startDate: {
          type: Date,
          default: "",
        },
        endDate: {
          type: Date,
          default: "",
        },
        coverLetter: {
          type: String,
          default: "",
        },
      },
    ],
  },
});

userSchema.methods = {
  getJwtAccessToken: function () {
    console.log("eg");
    return JWT.sign({ _id: this._id }, config.ACCESS_TOKEN, {
      expiresIn: config.ACCESS_TOKEN_EXPIRY,
    });
  },
  getJwtRefreshToken: function () {
    return JWT.sign({ _id: this._id }, config.REFRESH_TOKEN, {
      expiresIn: config.REF_TOKEN_EXPIRY,
    });
  },
};

const User = mongoose.model("User", userSchema);

export default User;
