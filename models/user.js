const mongoose = require("mongoose");

const nameRegex = /^[A-Za-z]+$/;
const usernameRegex = /^\S+$/; // No whitespace
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      validate: {
        validator: (v) => nameRegex.test(v),
        message: "First name should contain only letters.",
      },
    },
    lastName: {
      type: String,
      required: true,
      validate: {
        validator: (v) => nameRegex.test(v),
        message: "Last name should contain only letters.",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => usernameRegex.test(v),
        message: "Username should not contain spaces.",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => emailRegex.test(v),
        message: "Email is not valid.",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long."],
    },
    userStats: {
      type: [
        {
          platform: {
            type: String,
            unique: true,
            required: [true, "must provide name"],
            trim: true,
            maxlength: [20, "name can not be more than 20 characters"],
          },
          handle: {
            type: String,
            required: [true, "must provide handle"],
            trim: true,
            maxlength: [20, "name can not be more than 20 characters"],
          },
          solved: {
            type: Number,
            default: 0,
          },
          ratings: {
            type: [[mongoose.Schema.Types.Mixed]], // Nested array
            default: [],
          },
          stats: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
          },
        },
      ],
      default: [], // Default value for userStats is an empty array
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
