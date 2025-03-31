import React from "react";
import { useEffect, useState } from "react";
import "./App.css";
import PieChart from "./chart_components/PieChart.js";
import LineChart from "./chart_components/lineChart.js";
import axios from "axios";

export default function App() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/resources")
      .then((response) => setResources(response.data))
      .catch((error) => console.error("Error fetching data", error));
  }, []);
  let contestRatings = [["Time"]];
  let sum = 0;
  resources.forEach((resource, index) => {
    for (let i = 1; i < contestRatings.length; i++) {
      contestRatings[i].push(null);
    }
    sum += resource.solved;
    contestRatings[0].push(resource.name);
    const Contests = resource.ratings;
    for (let i = 0; i < Contests.length; i++) {
      let temp = [new Date(Contests[i][0])];
      for (let j = 1; j <= contestRatings[0].length - 2; j++) {
        temp.push(null);
      }
      temp.push(Contests[i][1]);
      contestRatings.push(temp);
    }
  });
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
    </div>
  );
}
