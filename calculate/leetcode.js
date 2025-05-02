const { fetchProblemData, fetchContestData } = require("../api/leetcode.js");
async function calculate_LC_contestRatings(handle) {
  try {
    let contestRatings = [];
    const data = await fetchContestData(handle);
    let maxRating = 0,
      currentRating = 0;
    const attendedContests = data.userContestRankingHistory.filter(
      (contests) => {
        return contests.attended;
      }
    );
    attendedContests.forEach((contest) => {
      let temp = [new Date(contest.contest.startTime * 1000)];
      temp.push(parseInt(contest.rating));
      currentRating = contest.rating;
      if (currentRating > maxRating) maxRating = currentRating;
      contestRatings.push(temp);
    });
    return { contestRatings, maxRating, currentRating };
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
async function calculate_LC_SolvedCount(handle) {
  try {
    const response = await fetchProblemData(handle);
    const data = response.matchedUser.submitStats.acSubmissionNum[0].count;
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
async function calculate_LC_stats(handle) {
  try {
    const response = await fetchProblemData(handle);
    const data = await fetchProblemData(handle);
    const totalSubmissions =
      data.matchedUser.submitStats.totalSubmissionNum[0].submissions;
    let league = "Unranked";
    data.matchedUser.badges.forEach((badges) => {
      if (badges.displayName === "Knight") league = badges.displayName;
      if (badges.displayName === "Guardian") league = badges.displayName;
    });
    let stats = {
      solved: [],
      difficulty: [],
      league,
    };
    const submissionCalendar = JSON.parse(
      response.matchedUser.submissionCalendar
    );
    for (const [timestamp, count] of Object.entries(submissionCalendar)) {
      stats.solved.push([timestamp, parseInt(count)]);
    }
    response.matchedUser.submitStats.acSubmissionNum.forEach((solved) => {
      stats.difficulty.push([solved.difficulty, solved.count]);
    });
    return { stats, totalSubmissions };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
module.exports = {
  calculate_LC_contestRatings,
  calculate_LC_SolvedCount,
  calculate_LC_stats,
};
