const {
  fetchSolvedCount,
  fetchContestData,
  fetchSolvedProblems,
} = require("../api/codechef");

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
    const data = response;
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
async function calculate_CC_stats(handle) {
  try {
    let verdicts = await fetchSolvedProblems(handle);
    let stats = {
      solved: new Map(),
    };
    verdicts = verdicts.filter((submissions) => submissions.result != "");
    let flag = new Map();
    verdicts.forEach((problem) => {
      if (flag[problem.problem] === undefined) {
        flag[problem.problem] = 1;
      } else return false;
      const normalizedDate = `20${problem.date.substring(
        15,
        17
      )}-${problem.date.substring(12, 14)}-${problem.date.substring(9, 11)}`;
      stats.solved.set(
        normalizedDate,
        stats.solved.get(normalizedDate) + 1 || 1
      );
    });
    stats.solved = Array.from(stats.solved);
    return stats;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
module.exports = {
  calculate_CC_contestRatings,
  calculate_CC_solvedProblemCount,
  calculate_CC_stats,
};
