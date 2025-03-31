const { fetchProblemData, fetchContestData } = require("../api/leetcode.js");
async function calculate_LC_contestRatings(handle) {
  try {
    const { contestParticipation: Contests } = await fetchContestData(handle);
    let contestRatings = [];
    for (let i = 0; i < Contests.length; i++) {
      let temp = [new Date(Contests[i].contest.startTime * 1000)];
      temp.push(parseInt(Contests[i].rating));
      contestRatings.push(temp);
    }
    return contestRatings;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
async function calculate_LC_SolvedCount(handle) {
  try {
    const response = await fetchProblemData(handle);
    const data = await response.solvedProblem;
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
module.exports = { calculate_LC_contestRatings, calculate_LC_SolvedCount };
