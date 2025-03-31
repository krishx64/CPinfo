const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema({
  name: {
    type: String,
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
    // validate: {
    //   validator: function (v) {
    //     // Ensure each sub-array has exactly 2 elements: [Date, Number]
    //     return (
    //       Array.isArray(v) &&
    //       v.every(
    //         (item) =>
    //           Array.isArray(item) &&
    //           item.length === 2 &&
    //           item[0] instanceof Date &&
    //           typeof item[1] === "number"
    //       )
    //     );
    //   },
    //   message: "Each entry in ratings must be an array of [Date, Number].",
    // },
  },
});

module.exports = mongoose.model("userInfo", userInfoSchema);
