import { fetchContestData, fetchProblemData } from "./api/codeforces.js";
import { Chart } from "react-google-charts";

const { result } = await fetchProblemData("jaiswalxkrish");
let verdictOk = result;
let allVerdict = new Map();
for (let i = 0; i < verdictOk.length; i++) {
  allVerdict.get(verdictOk[i].verdict)
    ? allVerdict.set(
        verdictOk[i].verdict,
        allVerdict.get(verdictOk[i].verdict) + 1
      )
    : allVerdict.set(verdictOk[i].verdict, 1);
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
  allData.push([allDataTemp[i][1], allDataTemp[i][0]]);
}
console.log(allDataTemp);
verdictOk = verdictOk.filter((problem) => problem.verdict === "OK");
const solvedProblems = new Map();
verdictOk = verdictOk.filter((problem) => {
  if (solvedProblems.get(problem.problem.name) === problem.problem.contestId) {
    return false;
  }
  solvedProblems.set(problem.problem.name, problem.problem.contestId);
  return true;
});

export default function App() {
  const options = {
    title: "Submissions",
  };
  return (
    <div>
      <h1>Hello, Nigga!</h1>
      <h2>No. of problems solved in Codeforces: {verdictOk.length}</h2>
      <Chart
        chartType="PieChart"
        data={allData}
        options={options}
        width={"100%"}
        height={"400px"}
      />
    </div>
  );
}
