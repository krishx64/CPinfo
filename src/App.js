import { fetchContestData, fetchProblemData } from "./api/codeforces.js";
import React from "react";
import "./PieChart.js";
import {
  calculate_CF_verdicts,
  calculate_CF_Accepted,
} from "./calculate/codeforces.js";
import { Chart } from "react-google-charts";
import PieChart from "./PieChart.js";

const { result } = await fetchProblemData("jaiswalxkrish");
let verdictOk = calculate_CF_Accepted(result);
let allData = calculate_CF_verdicts(result);

export default function App() {
  const dataL = [
    ["x", "dogs"],
    [0, 0],
    [1, 10],
    [2, 23],
    [3, 17],
    [4, 18],
    [5, 9],
    [6, 11],
    [7, 27],
    [8, 33],
    [9, 40],
    [10, 32],
    [11, 35],
  ];

  const optionLine = {
    title: "Line Chart Example",
    hAxis: { title: "Time" },
    vAxis: { title: "Popularity" },
    legend: "none",
  };
  return (
    <div>
      <h1>Hello, Nigga!</h1>
      <h2>No. of problems solved in Codeforces: {verdictOk.length}</h2>
      <PieChart data={allData} />
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={dataL}
        options={optionLine}
      />
    </div>
  );
}
