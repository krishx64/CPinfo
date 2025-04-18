import React from "react";
import { Chart } from "react-google-charts";
import "./columnChart.css"; // Import your custom CSS file for styling

export default function ColumnChart({ data, title }) {
  const header = data[0];
  const rows = data.slice(1);
  rows.sort();
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
      title: "Time",
      textStyle: { color: "#FFFFFF" }, // X-axis text color
      titleTextStyle: { color: "#FFFFFF", bold: true }, // X-axis title color
      gridlines: {
        color: "#808080", // Gridline color
      },
    },
    vAxis: {
      title: "Rating",
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
        width="600px"
        height="500px"
        data={data}
        options={option}
      />
    </div>
  );
}
