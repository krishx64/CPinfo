const { fetchProblemData, fetchContestData } = require("../api/leetcode.js");
async function calculate_LC_contestRatings(handle) {
  try {
    let contestRatings = [];
    const data = await fetchContestData(handle);
    const attendedContests = data.userContestRankingHistory.filter(
      (contests) => {
        return contests.attended;
      }
    );
    attendedContests.forEach((contest) => {
      let temp = [new Date(contest.contest.startTime * 1000)];
      temp.push(parseInt(contest.rating));
      contestRatings.push(temp);
    });
    return contestRatings;
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
    let stats = {
      solved: [],
      difficulty: [],
    };
    const submissionCalendar = JSON.parse(
      response.matchedUser.submissionCalendar
    );
    for (const [timestamp, count] of Object.entries(submissionCalendar)) {
      const localDate = new Date(timestamp * 1000);
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, "0");
      const day = String(localDate.getDate()).padStart(2, "0");

      const normalizedDate = `${year}-${month}-${day}`;
      stats.solved.push([normalizedDate, parseInt(count)]);
    }
    response.matchedUser.submitStats.acSubmissionNum.forEach((solved) => {
      stats.difficulty.push(solved.difficulty, solved.count);
    });
    return stats;
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
