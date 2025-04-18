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
} = require("../calculate/codechef.js");
const { addInfo } = require("./wrapper.js");
const userInfo = require("../models/userInfo.js");

async function addToDB(handleName, errorLog, cache) {
  try {
    errorArray = [];
    await addInfo(
      calculate_AC_solvedProblemCount,
      calculate_AC_contestRatings,
      "Atcoder",
      handleName.ac,
      errorLog,
      calculate_AC_stats
    );
    await addInfo(
      calculate_CF_Accepted,
      calculate_CF_contestRatings,
      "Codeforces",
      handleName.cf,
      errorLog,
      calculate_CF_stats
    );
    await addInfo(
      calculate_LC_SolvedCount,
      calculate_LC_contestRatings,
      "Leetcode",
      handleName.lc,
      errorLog,
      calculate_LC_stats
    );
    await addInfo(
      calculate_CC_solvedProblemCount,
      calculate_CC_contestRatings,
      "Codechef",
      handleName.cc,
      errorLog
    );
    cache.resourcesCache = await userInfo.find();
  } catch (error) {
    console.error("Error in addToDB:", error.message);
    throw error; // Re-throw the error to be handled by the caller
  }
}
module.exports = {
  addToDB,
};
