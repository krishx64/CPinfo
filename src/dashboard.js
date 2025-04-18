import React from "react";
import { useEffect, useState } from "react";
import "./dashboard.css";
import PieChart from "./chart_components/PieChart.js";
import LineChart from "./chart_components/lineChart.js";
import axios from "axios";
import Heatmap from "./chart_components/heatmap.js";
import ColumnChart from "./chart_components/columnChart.js";

export default function Dashboard() {
  const [errorLog, setErrorLog] = useState([]);
  const [resources, setResources] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [solvedRatings, setSolvedRatings] = useState([["Rating", "Solved"]]);
  const [difficultyRatings, setDifficultyRatings] = useState([
    ["Difficulty", "Solved"],
  ]);
  const [tags, setTags] = useState([]);
  const [contestRatings, setContestRatings] = useState([["Time"]]);
  const [sum, setSum] = useState(0);
  useEffect(() => {
    const fetchResources = () => {
      axios
        .get("http://localhost:3000/resources")
        .then((response) => setResources(response.data))
        .catch((error) => console.error("Error fetching data", error));
    };
    const fetchErrorLogs = () => {
      axios
        .get("http://localhost:3000/resources/errors")
        .then((response) => setErrorLog(response.data))
        .catch((error) => console.error("Error fetching data", error));
    };

    // Fetch resources immediately when the component mounts
    const fetchAllData = () => {
      fetchResources();
      fetchErrorLogs();
    };

    fetchAllData();

    // Set up an interval to fetch resources every 1 seconds
    const intervalId = setInterval(fetchAllData, 10000);

    // // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  console.log(resources);
  useEffect(() => {
    let newContestRatings = [["Time"]];
    let newSum = 0;
    let newHeatmapData = [
      [
        { type: "date", id: "Date" },
        { type: "number", id: "Solved" },
      ], // Add column definitions here
    ];
    let newTags = [];
    let newSolvedRatings = [["Rating", "Solved"]];
    let newDifficultyRatings = [["Difficulty", "Solved"]];
    resources.forEach((resource, index) => {
      newSum += resource.solved;
      const Contests = resource.ratings;
      if (Contests.length === 0) return false;
      for (let i = 1; i < newContestRatings.length; i++) {
        newContestRatings[i].push(null);
      }
      newContestRatings[0].push(resource.name);
      for (let i = 0; i < Contests.length; i++) {
        let temp = [new Date(Contests[i][0])];
        for (let j = 1; j <= newContestRatings[0].length - 2; j++) {
          temp.push(null);
        }
        temp.push(parseInt(Contests[i][1]));
        newContestRatings.push(temp);
      }
      if (resource.stats !== undefined) {
        let heatmapTemp = new Map();
        resource.stats.solved.forEach((problem) => {
          const dateKey = new Date(problem[0]);
          if (!heatmapTemp.has(dateKey)) {
            heatmapTemp.set(dateKey, 0);
          }
          heatmapTemp.set(
            dateKey,
            heatmapTemp.get(dateKey) + parseInt(problem[1])
          );
        });
        for (const [key, value] of heatmapTemp.entries()) {
          newHeatmapData.push([key, parseInt(value)]);
        }
        // newTags.push(["Tags", "Solved"]);
        // resource.stats.tags.forEach((tag) => {
        //   newTags.push([tag[0], tag[1]]);
        // });
        // resource.stats.rating.forEach((rating) => {
        //   newSolvedRatings.push([rating[0], parseInt(rating[1])]);
        // });
        // resource.stats.difficulty.forEach((index) => {
        //   newDifficultyRatings.push([index[0], parseInt(index[1])]);
        // });
      }
    });
    // setSolvedRatings(newSolvedRatings);
    // setDifficultyRatings(newDifficultyRatings);
    setTags(newTags);
    setHeatmapData(newHeatmapData);
    setContestRatings(newContestRatings);
    setSum(newSum);
  }, [resources]);
  return (
    <div id="info-container">
      <h1>Hello, World!</h1>
      <div className="solved-info-container">
        {resources.map((resource, index) => (
          <h2 key={index}>
            Solved in {resource.name}: {resource.solved}
          </h2>
        ))}
        <h2>Total: {sum}</h2>
      </div>
      <LineChart data={contestRatings} />
      {errorLog.length > 0 && (
        <div className="error-log">
          <h3>Error Log:</h3>
          <ul>
            {errorLog.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      {/* <PieChart data={tags} />
      <div className="column-container">
        <ColumnChart data={solvedRatings} title="Solved problem ratings" />
        <ColumnChart
          data={difficultyRatings}
          title="Solved problem difficulty"
        />
      </div> */}
      <div id="parent-div">
        <Heatmap data={heatmapData} />
      </div>
    </div>
  );
}
