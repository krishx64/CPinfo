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
function calculate_CF_Accepted(Submissions) {
  let verdictOk = Submissions;
  verdictOk = verdictOk.filter((problem) => problem.verdict === "OK");
  const solvedProblems = new Map();
  verdictOk = verdictOk.filter((problem) => {
    if (
      solvedProblems.get(problem.problem.name) === problem.problem.contestId
    ) {
      return false;
    }
    solvedProblems.set(problem.problem.name, problem.problem.contestId);
    return true;
  });
  return verdictOk;
}
module.exports = { calculate_CF_verdicts, calculate_CF_Accepted };
