const {
  fetchSolvedCount,
  fetchContestData,
  fetchSolvedProblems,
} = require("../api/codechef");
const User = require("../models/user");

function parseRelativeToEpochSeconds(text) {
  const now = new Date();
  const [amountStr, unit] = text.split(" ");
  const amount = parseInt(amountStr);
  if (isNaN(amount)) return Math.floor(now.getTime() / 1000);

  let date = new Date(now); // clone

  switch (unit) {
    case "sec":
    case "seconds":
      date.setUTCSeconds(date.getUTCSeconds() - amount);
      break;
    case "min":
    case "minutes":
      date.setUTCMinutes(date.getUTCMinutes() - amount);
      break;
    case "hour":
    case "hours":
      date.setUTCHours(date.getUTCHours() - amount);
      break;
    case "day":
    case "days":
      date.setUTCDate(date.getUTCDate() - amount);
      break;
  }

  return Math.floor(date.getTime() / 1000); // return epoch seconds (UTC)
}

async function calculate_CC_contestRatings(handle) {
  try {
    const { ratingData: Contests } = await fetchContestData(handle);
    let maxRating = 0,
      currentRating = 0;
    let contestRatings = [];
    for (let i = 0; i < Contests.length; i++) {
      let someDate = new Date(Contests[i].end_date);
      someDate = someDate.getTime();
      let temp = [new Date(someDate)];
      temp.push(parseInt(Contests[i].rating));
      currentRating = Contests[i].rating;
      if (currentRating > maxRating) maxRating = currentRating;
      contestRatings.push(temp);
    }
    return { contestRatings, maxRating, currentRating };
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
    ({
      allSubmissions: verdicts,
      trueMaxPage: pagesUpdated,
      totalSubmissions,
    } = await fetchSolvedProblems(handle, pages));
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
      let epochSeconds = 0;
      if (problem.date.length < 17) {
        epochSeconds = parseRelativeToEpochSeconds(problem.date);
      } else {
        let dateStr = `20${problem.date.substring(
          15,
          17
        )}-${problem.date.substring(12, 14)}-${problem.date.substring(9, 11)}`;
        const [year, month, day] = dateStr.split("-").map(Number);
        epochSeconds = Math.floor(Date.UTC(year, month - 1, day) / 1000);
      }
      stats.solved.set(epochSeconds, stats.solved.get(epochSeconds) + 1 || 1);
    });
    for (const [key, value] of flag) {
      stats.problemName.push(key);
    }
    stats.solved = Array.from(stats.solved);
    let totalSolved = 0;
    stats.solved.forEach((solved) => {
      totalSolved += solved[1];
    });
    if (userStats && userStats.handle)
      stats.solved.push(...userStats.stats.solved);
    return { stats, totalSubmissions, totalSolved };
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
