import React from "react";
import { Chart } from "react-google-charts";

export default function BarChart({ data }) {
  const header = data[0];
  const rows = data.slice(1);
  rows.sort((a, b) => a[1] < b[1]);
  data = [header, ...rows];
  const options = {
    backgroundColor: "#22252c",
    title: "Solved across all platforms",
    colors: ["#6e40aa"],
    chartArea: { width: "50%" },
    hAxis: {
      title: "No. of problems solved",
      minValue: 0,
      textStyle: { color: "#FFFFFF" }, // X-axis text color
      titleTextStyle: { color: "#FFFFFF", bold: true }, // X-axis title color
      gridlines: {
        color: "#22252c", // Gridline color
      },
    },
    vAxis: {
      title: "Platform",
      textStyle: { color: "#FFFFFF" }, // Y-axis text color
      titleTextStyle: { color: "#FFFFFF", bold: true }, // Y-axis title color
      gridlines: {
        color: "#22252c", // Gridline color
      },
    },
    legend: "none",
    // legend: {
    //   position: "right",
    //   textStyle: {
    //     color: "#FFFFFF", // Change legend text color
    //     fontSize: 14, // Optional: Adjust font size
    //   },
    // },
    titleTextStyle: {
      color: "#FFFFFF", // Title text color
      fontSize: 18,
      bold: true,
    },
  };
  return (
    <div className="bar-chart-container chart-container">
      <Chart
        chartType="BarChart"
        width="500px"
        height="300px"
        data={data}
        options={options}
        legendToggle
      />
    </div>
  );
}
