const {
  fetchSolvedCount,
  fetchContestData,
  fetchSolvedProblems,
} = require("../api/codechef");
const User = require("../models/user");

async function calculate_CC_contestRatings(handle) {
  try {
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
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
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
async function calculate_CC_stats(handle, username) {
  try {
    let { userStats } = await User.findOne({ username: username }).select(
      "-password"
    );
    userStats = userStats.filter((stats) => stats.platform === "Codechef");
    userStats = userStats ? userStats[0] : null;
    let pages = 0;
    let problemUpdated = [];
    if (userStats && userStats.handle === handle) {
      ({ pagesUpdated: pages, problemName: problemUpdated } = userStats.stats);
    }
    ({ allSubmissions: verdicts, trueMaxPage: pagesUpdated } =
      await fetchSolvedProblems(handle, pages));
    let stats = {
      solved: new Map(),
      pagesUpdated: pagesUpdated,
      problemName: [],
    };
    verdicts = verdicts.filter((submissions) => submissions.result != "");
    let flag = new Map();
    problemUpdated.forEach((name) => {
      flag.set(name, 1);
    });
    verdicts.forEach((problem) => {
      if (!flag.has(problem.problem)) {
        flag.set(problem.problem, 1);
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
    for (const [key, value] of flag) {
      stats.problemName.push(key);
    }
    stats.solved = Array.from(stats.solved);
    if (userStats && userStats.handle)
      stats.solved.push(...userStats.stats.solved);
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
