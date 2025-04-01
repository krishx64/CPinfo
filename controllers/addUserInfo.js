const {
  calculate_AC_solvedProblemCount,
  calculate_AC_contestRatings,
} = require("../calculate/atcoder.js");
const {
  calculate_CF_Accepted,
  calculate_CF_contestRatings,
} = require("../calculate/codeforces.js");
const {
  calculate_LC_SolvedCount,
  calculate_LC_contestRatings,
} = require("../calculate/leetcode.js");
const {
  calculate_CC_solvedProblemCount,
  calculate_CC_contestRatings,
} = require("../calculate/codechef.js");
const { addInfo } = require("./wrapper.js");
const userInfo = require("../models/userInfo.js");

async function addToDB(handleName, errorArray, cache) {
  try {
    errorArray = [];
    await addInfo(
      calculate_AC_solvedProblemCount,
      calculate_AC_contestRatings,
      "Atcoder",
      handleName.ac,
      errorArray
    );
    await addInfo(
      calculate_CF_Accepted,
      calculate_CF_contestRatings,
      "Codeforces",
      handleName.cf,
      errorArray
    );
    await addInfo(
      calculate_LC_SolvedCount,
      calculate_LC_contestRatings,
      "Leetcode",
      handleName.lc,
      errorArray
    );
    await addInfo(
      calculate_CC_solvedProblemCount,
      calculate_CC_contestRatings,
      "Codechef",
      handleName.cc,
      errorArray
    );
    cache.resourcesCache = await userInfo.find();
  } catch (error) {
    console.error("Error in addToDB:", error.message);
    errorArray.push("Error updating database: " + error.message);
    throw error; // Re-throw the error to be handled by the caller
  }
}
module.exports = {
  addToDB,
};
