import { fetchContestData, fetchProblemData } from "./api/codeforces.js";

export default function App() {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
}
fetchContestData("jaiswalxkrish");
let problems = fetchProblemData("jaiswalxkrish");
