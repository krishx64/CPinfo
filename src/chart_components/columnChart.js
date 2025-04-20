import React from "react";
import { Chart } from "react-google-charts";
import "./columnChart.css"; // Import your custom CSS file for styling

export default function ColumnChart({ data, title }) {
  const header = data[0];
  const rows = data.slice(1);
  rows.sort();
  let isNumber = true;
  if (rows.length >= 1 && typeof rows[0][0] !== "number") isNumber = false;
  const maxRatingSolved = Math.max(...rows.map((row) => row[0]));
  data = [header, ...rows];
  const option = {
    title: title,
    backgroundColor: "#28282B",
    colors: [
      "#6e40aa",
      "#963db3",
      "#bf3caf",
      "#e4419d",
      "#fe4b83",
      "#ff5e63",
      "#ff7847",
      "#fb9633",
      "#e2b72f",
      "#c6d63c",
      "#aff05b",
    ],
    hAxis: {
      title: "Difficulty",
      textStyle: { color: "#FFFFFF" }, // X-axis text color
      titleTextStyle: { color: "#FFFFFF", bold: true }, // X-axis title color
      gridlines: {
        color: "#808080", // Gridline color
      },
      slantedText: isNumber,
      slantedTextAngle: 45,
      viewWindow: {
        max: maxRatingSolved + 70,
      },
      ticks: [
        800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900,
        2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900, 3000, 3100,
        3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200,
      ],
    },
    vAxis: {
      title: "Solved",
      textStyle: { color: "#FFFFFF" }, // Y-axis text color
      titleTextStyle: { color: "#FFFFFF", bold: true }, // Y-axis title color
      gridlines: {
        color: "#808080", // Gridline color
      },
    },
    legend: {
      position: "right",
      textStyle: {
        color: "#FFFFFF", // Change legend text color
        fontSize: 14, // Optional: Adjust font size
      },
    },
    titleTextStyle: {
      color: "#FFFFFF", // Title text color
      fontSize: 18,
      bold: true,
    },
  };
  return (
    <div className="column-chart-container">
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="600px"
        data={data}
        options={option}
      />
    </div>
  );
}
