const {
  fetchProblemSolvedCount,
  fetchContestData,
  fetchProblemData,
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
async function calculate_AC_stats(handle) {
  try {
    let verdicts = await fetchProblemData(handle, 0);
    let tempVerdict = verdicts;
    while (tempVerdict.length !== 0) {
      let time = tempVerdict[tempVerdict.length - 1].epoch_second + 1;
      tempVerdict = await fetchProblemData(handle, time);
      tempVerdict.forEach((problem) => verdicts.push(problem));
    }
    verdicts = verdicts.filter((problem) => problem.result === "AC");
    let stats = {
      solved: new Map(),
      difficulty: new Map(),
    };
    let flag = new Map();
    verdicts.forEach((problem) => {
      if (flag[problem.problem_id] === undefined) {
        flag[problem.problem_id] = 1;
      } else return false;
      stats.solved.set(
        problem.epoch_second,
        stats.solved.get(problem.epoch_second) + 1 || 1
      );
      const index =
        problem.problem_id[problem.problem_id.length - 1].toUpperCase();
      if ((index >= "A" && index <= "Z") || (index >= "a" && index <= "z"))
        stats.difficulty.set(index, stats.difficulty.get(index) + 1 || 1);
    });
    stats.solved = Array.from(stats.solved);
    stats.difficulty = Array.from(stats.difficulty);
    return stats;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
module.exports = {
  calculate_AC_contestRatings,
  calculate_AC_solvedProblemCount,
  calculate_AC_stats,
};
