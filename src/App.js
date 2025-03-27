import { fetchContestData, fetchProblemData } from "./api/codeforces.js";

const { result } = await fetchProblemData("jaiswalxkrish");
let verdictOk = result;
verdictOk = verdictOk.filter(
  (problem) => problem.verdict === "SUBMITTED" || problem.verdict === "OK"
);
const solvedProblems = new Map();
verdictOk = verdictOk.filter((problem) => {
  if (solvedProblems.get(problem.problem.name) === problem.problem.contestId) {
    console.log(problem.problem.contestId, problem.problem.name);
    return false;
  }
  solvedProblems.set(problem.problem.name, problem.problem.contestId);
  return true;
});
console.log(verdictOk);

export default function App() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <h2>No. of problems solved in Codeforces: {verdictOk.length}</h2>
    </div>
  );
}
