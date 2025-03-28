import { fetchContestData, fetchProblemData } from "./api/codeforces.js";
import React from "react";
import {
  calculate_CF_verdicts,
  calculate_CF_Accepted,
} from "./calculate/codeforces.js";
import PieChart from "./PieChart.js";
import LineChart from "./lineChart.js";

const { result } = await fetchProblemData("jaiswalxkrish");
const verdictOk = calculate_CF_Accepted(result);
const allData = calculate_CF_verdicts(result);

export default function App() {
  return (
    <div>
      <h1>Hello, Nigga!</h1>
      <h2>No. of problems solved in Codeforces: {verdictOk.length}</h2>
      <PieChart data={allData} />
      <LineChart />
    </div>
  );
}
