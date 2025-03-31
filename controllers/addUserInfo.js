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

let errorArray = [];

async function addToDB() {
  await addInfo(
    calculate_AC_solvedProblemCount,
    calculate_AC_contestRatings,
    "Atcoder",
    "jaiswalxkrish",
    errorArray
  );
  await addInfo(
    calculate_CF_Accepted,
    calculate_CF_contestRatings,
    "Codeforces",
    "jaiswalxkrish",
    errorArray
  );
  await addInfo(
    calculate_LC_SolvedCount,
    calculate_LC_contestRatings,
    "Leetcode",
    "jaiswalxkrish",
    errorArray
  );
  await addInfo(
    calculate_CC_solvedProblemCount,
    calculate_CC_contestRatings,
    "Codechef",
    "krishx64",
    errorArray
  );
  app.get("/resources", async (req, res) => {
    try {
      const userInfo = await userInfo.find();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
module.exports = {
  addToDB,
};
