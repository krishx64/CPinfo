import {
  fetchContestData as fetchCfContestData,
  fetchProblemData as fetchCfProblemData,
} from "./api/codeforces.js";
import { fetchData as fetchCcData } from "./api/codechef.js";
import React from "react";
import "./App.css";
import {
  calculate_CF_verdicts,
  calculate_CF_Accepted,
  calculate_CF_contestRatings,
} from "./calculate/codeforces.js";
import { calculate_CC_contestRatings } from "./calculate/codechef.js";
import PieChart from "./chart_components/PieChart.js";
import LineChart from "./chart_components/lineChart.js";
import { fetchData as fetchLCdata } from "./api/leetcode.js";
import { calculate_LC_contestRatings } from "./calculate/leetcode.js";

const CFhandle = "jaiswalXkrish";
const CChandle = "krishx64";
let contestRatings = [["Time"]];
const { result } = await fetchCfProblemData(CFhandle);
const contestData = await fetchCfContestData(CFhandle);
contestRatings = calculate_CF_contestRatings(
  contestData.result,
  contestRatings
);
const verdictOk = calculate_CF_Accepted(result);
const allData = calculate_CF_verdicts(result);

const { ratingData } = await fetchCcData(CChandle);
contestRatings = calculate_CC_contestRatings(ratingData, contestRatings);

const { contestParticipation } = await fetchLCdata(CFhandle);
contestRatings = calculate_LC_contestRatings(
  contestParticipation,
  contestRatings
);

console.log(contestRatings);
export default function App() {
  return (
    <div>
      <h1>Hello, {CFhandle}!</h1>
      <div class="info-container">
        <h2>No. of problems solved in Codeforces: {verdictOk.length}</h2>
        <PieChart data={allData} />
      </div>
      <LineChart data={contestRatings} />
    </div>
  );
}
