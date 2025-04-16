import React from "react";
import { useEffect, useState } from "react";
import "./dashboard.css";
import PieChart from "./chart_components/PieChart.js";
import LineChart from "./chart_components/lineChart.js";
import axios from "axios";
import CalResponsive from "./chart_components/cal-heatmap-responsive.js";

export default function Dashboard() {
  const [errorLog, setErrorLog] = useState([]);
  const [resources, setResources] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
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

  useEffect(() => {
    let newContestRatings = [["Time"]];
    let newSum = 0;
    let newHeatmapData = [];
    let newTags = [];
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
        resource.stats.solved.forEach((problem) => {
          const localDate = new Date(problem[0]); // Convert to Date object
          const offset = localDate.getTimezoneOffset(); // Get time zone offset in minutes
          const adjustedDate = new Date(
            localDate.getTime() - offset * 60 * 1000
          );
          newHeatmapData.push({
            date: adjustedDate.toISOString().split("T")[0],
            count: problem[1],
          });
        });
        newTags.push(["Tags", "Solved"]);
        resource.stats.tags.forEach((tag) => {
          newTags.push([tag[0], tag[1]]);
        });
      }
    });
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
      <PieChart data={tags} />
      <div id="parent-div">
        <h2>Responsive Calendar</h2>
        <CalResponsive data={heatmapData} />
      </div>
    </div>
  );
}
