const {
  fetchProblemSolvedCount,
  fetchContestData,
} = require("../api/atcoder.js");
async function calculate_AC_contestRatings(handle) {
  try {
    const Contests = await fetchContestData(handle);
    let contestRatings = [];
    for (let i = 0; i < Contests.length; i++) {
      let someDate = new Date(Contests[i].EndTime);
      someDate = someDate.getTime();
      let temp = [new Date(someDate)];
      temp.push(parseInt(Contests[i].NewRating));
      contestRatings.push(temp);
    }
    return contestRatings;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
async function calculate_AC_solvedProblemCount(handle) {
  try {
    const response = await fetchProblemSolvedCount(handle);
    const data = await response.count;
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
module.exports = {
  calculate_AC_contestRatings,
  calculate_AC_solvedProblemCount,
};
