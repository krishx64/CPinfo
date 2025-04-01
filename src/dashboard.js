import React from "react";
import { useEffect, useState } from "react";
import "./dashboard.css";
import PieChart from "./chart_components/PieChart.js";
import LineChart from "./chart_components/lineChart.js";
import axios from "axios";

export default function Dashboard() {
  const [errorLog, setErrorLog] = useState([]);
  const [resources, setResources] = useState([]);
  const [contestRatings, setContestRatings] = useState([["Time"]]);
  const [sum, setSum] = useState(0);
  useEffect(() => {
    const fetchResources = () => {
      axios
        .get("http://localhost:3000/resources")
        .then((response) => setResources(response.data))
        .catch((error) => console.error("Error fetching data", error));
    };

    // Fetch resources immediately when the component mounts
    fetchResources();

    // Set up an interval to fetch resources every 10 seconds
    const intervalId = setInterval(fetchResources, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:3000/resources")
      .then((response) => setResources(response.data))
      .catch((error) => console.error("Error fetching data", error));
  }, []);

  useEffect(() => {
    let newContestRatings = [["Time"]];
    let newSum = 0;
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
    });
    setContestRatings(newContestRatings);
    setSum(newSum);
  }, [resources]);
  return (
    <div>
      <h1>Hello, World!</h1>
      {resources.map((resource, index) => (
        <h2 key={index}>
          No. of problems solved in {resource.name}: {resource.solved}
        </h2>
      ))}
      <h2>Total: {sum}</h2>
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
    </div>
  );
}
