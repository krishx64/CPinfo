const { fetchSolvedCount, fetchContestData } = require("../api/codechef");
async function calculate_CC_contestRatings(handle) {
  const { ratingData: Contests } = await fetchContestData(handle);
  let contestRatings = [];
  for (let i = 0; i < Contests.length; i++) {
    let someDate = new Date(Contests[i].end_date);
    someDate = someDate.getTime();
    let temp = [new Date(someDate)];
    temp.push(parseInt(Contests[i].rating));
    contestRatings.push(temp);
  }
  return contestRatings;
}
async function calculate_CC_solvedProblemCount(handle) {
  try {
    const response = await fetchSolvedCount(handle);
    const data = await response;
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
module.exports = {
  calculate_CC_contestRatings,
  calculate_CC_solvedProblemCount,
};
