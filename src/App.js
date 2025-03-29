import React from "react";
import "./App.css";
import PieChart from "./chart_components/PieChart.js";
import LineChart from "./chart_components/lineChart.js";
import {
  fetchContestData as fetchCfContestData,
  fetchProblemData as fetchCfProblemData,
} from "./api/codeforces.js";
import {
  fetchContestData as fetchCCContestData,
  fetchSolvedCount as fetchCCSolvedCount,
} from "./api/codechef.js";
import {
  calculate_CF_verdicts,
  calculate_CF_Accepted,
  calculate_CF_contestRatings,
} from "./calculate/codeforces.js";
import { calculate_CC_contestRatings } from "./calculate/codechef.js";
import {
  fetchContestData as fetchLCContestdata,
  fetchProblemData as fetchLCProblemData,
} from "./api/leetcode.js";
import { calculate_LC_contestRatings } from "./calculate/leetcode.js";
import { calculate_AC_contestRatings } from "./calculate/atcoder.js";
import {
  fetchContestData as fetchACContestData,
  fetchProblemSolvedData as fetchACProblemSolvedData,
} from "./api/atcoder.js";

const CFhandle = "kelvin_0179";
const LChandle = "kelvin_0179";
const AChandle = "kelvin_0179";
const CChandle = "kelvin_0179";
const { result } = await fetchCfProblemData(CFhandle);
const CFsolved = calculate_CF_Accepted(result);
const allData = calculate_CF_verdicts(result);
const { solvedProblem: LCsolved } = await fetchLCProblemData(LChandle);
const { count: ACsolved } = await fetchACProblemSolvedData(AChandle);
const CCSolved = await fetchCCSolvedCount(CChandle);

let contestRatings = [["Time"]];
const { result: contestData } = await fetchCfContestData(CFhandle);
if (contestData !== undefined && contestData.length > 0) {
  contestRatings = calculate_CF_contestRatings(contestData, contestRatings);
}

const { ratingData } = await fetchCCContestData(CChandle);
if (ratingData !== undefined && ratingData.length > 0) {
  contestRatings = calculate_CC_contestRatings(ratingData, contestRatings);
}

const { contestParticipation } = await fetchLCContestdata(LChandle);
if (contestParticipation !== undefined && contestParticipation.length > 0) {
  contestRatings = calculate_LC_contestRatings(
    contestParticipation,
    contestRatings
  );
}

const atcoderContest = await fetchACContestData(AChandle);
if (atcoderContest !== undefined && atcoderContest.length > 0) {
  contestRatings = calculate_AC_contestRatings(atcoderContest, contestRatings);
}

console.log(contestRatings);
export default function App() {
  return (
    <div class="all-contents">
      <h1>Hello, {CFhandle}!</h1>
      <div class="info-container">
        <div>
          <h2>No. of problems solved in Codeforces: {CFsolved.length}</h2>
          <h2>No. of problems solved in Codechef: {CCSolved}</h2>
          <h2>No. of problems solved in Atcoder: {ACsolved}</h2>
          <h2>No. of problems solved in Leetcode: {LCsolved}</h2>
          <h2>
            Total: {parseInt(LCsolved) + ACsolved + CCSolved + CFsolved.length}
          </h2>
        </div>
        <PieChart data={allData} />
      </div>
      <LineChart data={contestRatings} />
    </div>
  );
}
