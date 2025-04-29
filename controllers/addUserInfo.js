const {
  calculate_AC_solvedProblemCount,
  calculate_AC_contestRatings,
  calculate_AC_stats,
} = require("../calculate/atcoder.js");
const {
  calculate_CF_Accepted,
  calculate_CF_contestRatings,
  calculate_CF_stats,
} = require("../calculate/codeforces.js");
const {
  calculate_LC_SolvedCount,
  calculate_LC_contestRatings,
  calculate_LC_stats,
} = require("../calculate/leetcode.js");
const {
  calculate_CC_solvedProblemCount,
  calculate_CC_contestRatings,
  calculate_CC_stats,
} = require("../calculate/codechef.js");
const { addInfo } = require("./wrapper.js");
const User = require("../models/user");
const redisClient = require("../db/redis.js");

async function addToDB(handleName, username, errorLog) {
  try {
    errorArray = [];
    await addInfo(
      username,
      calculate_AC_solvedProblemCount,
      calculate_AC_contestRatings,
      "Atcoder",
      handleName.ac,
      errorLog,
      calculate_AC_stats
    );
    await addInfo(
      username,
      calculate_CF_Accepted,
      calculate_CF_contestRatings,
      "Codeforces",
      handleName.cf,
      errorLog,
      calculate_CF_stats
    );
    await addInfo(
      username,
      calculate_LC_SolvedCount,
      calculate_LC_contestRatings,
      "Leetcode",
      handleName.lc,
      errorLog,
      calculate_LC_stats
    );
    await addInfo(
      username,
      calculate_CC_solvedProblemCount,
      calculate_CC_contestRatings,
      "Codechef",
      handleName.cc,
      errorLog,
      calculate_CC_stats
    );
  } catch (error) {
    console.error("Error in addToDB:", error.message);
    throw error; // Re-throw the error to be handled by the caller
  }
  try {
    await redisClient.del(`${username}_fetch`);
  } catch (error) {
    console.error("Error in redis:", error);
    throw error;
  }
}
module.exports = {
  addToDB,
};
