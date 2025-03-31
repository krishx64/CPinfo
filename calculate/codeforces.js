const { fetchProblemData, fetchContestData } = require("../api/codeforces");
function calculate_CF_verdicts(Submissions) {
  let allVerdict = new Map();
  for (let i = 0; i < Submissions.length; i++) {
    allVerdict.get(Submissions[i].verdict)
      ? allVerdict.set(
          Submissions[i].verdict,
          allVerdict.get(Submissions[i].verdict) + 1
        )
      : allVerdict.set(Submissions[i].verdict, 1);
  }
  let allDataTemp = [];
  for (let [value, key] of allVerdict) {
    allDataTemp.push([key, value]);
  }
  allDataTemp.sort(sortFunction);

  function sortFunction(a, b) {
    if (a[0] === b[0]) {
      return 0;
    } else {
      return a[0] > b[0] ? -1 : 1;
    }
  }
  let allData = [["Verdict", "Count"]];
  for (let i = 0; i < allDataTemp.length; i++) {
    allData.push([allDataTemp[i][1], allDataTemp[i][0] * 1.0]);
  }
  return allData;
}
async function calculate_CF_Accepted(handle) {
  try {
    let { result: verdictOk } = await fetchProblemData(handle);
    verdictOk = verdictOk.filter((problem) => problem.verdict === "OK");
    const solvedProblems = new Map();
    verdictOk = verdictOk.filter((problem) => {
      if (solvedProblems[problem.problem.contestId] === undefined) {
        solvedProblems[problem.problem.contestId] = [];
      }
      if (
        solvedProblems[problem.problem.contestId].find((index) => {
          return index === problem.problem.index;
        }) !== undefined
      ) {
        return false;
      }
      solvedProblems[problem.problem.contestId].push(problem.problem.index);
      return true;
    });
    return verdictOk.length;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
async function calculate_CF_contestRatings(handle) {
  try {
    const { result: Contests } = await fetchContestData(handle);
    let contestRatings = [];
    for (let i = 0; i < Contests.length; i++) {
      contestRatings.push([
        new Date(Contests[i].ratingUpdateTimeSeconds * 1000),
        parseInt(Contests[i].newRating),
      ]);
    }
    return contestRatings;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
module.exports = {
  calculate_CF_verdicts,
  calculate_CF_Accepted,
  calculate_CF_contestRatings,
};
