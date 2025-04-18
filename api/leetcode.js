const { LeetCode } = require("leetcode-query");
const leetcode = new LeetCode();
async function fetchContestData(handle) {
  try {
    const response = await leetcode.user_contest_info(handle);
    return response;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
async function fetchProblemData(handle) {
  try {
    const response = await leetcode.user(handle);
    return response;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
module.exports = { fetchContestData, fetchProblemData };
