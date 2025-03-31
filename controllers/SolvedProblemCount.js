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
const { addSolvedProblemCount } = require("./wrapper.js");

let errorArray = [];

async function addToDB() {
  // await addSolvedProblemCount(
  //   calculate_AC_solvedProblemCount,
  //   calculate_AC_contestRatings,
  //   "Atcoder",
  //   "jaiswalxkrish",
  //   errorArray
  // );
  // await addSolvedProblemCount(
  //   calculate_CF_Accepted,
  //   calculate_CF_contestRatings,
  //   "Codeforces",
  //   "jaiswalxkrish",
  //   errorArray
  // );
  // await addSolvedProblemCount(
  //   calculate_LC_SolvedCount,
  //   calculate_LC_contestRatings,
  //   "Leetcode",
  //   "jaiswalxkrish",
  //   errorArray
  // );
  await addSolvedProblemCount(
    calculate_CC_solvedProblemCount,
    calculate_CC_contestRatings,
    "Codechef",
    "krishx64",
    errorArray
  );
  console.log(errorArray);
}
module.exports = {
  addToDB,
};
