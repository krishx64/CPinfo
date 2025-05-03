import React from "react";
import { Chart } from "react-google-charts";
import "./chart.css"; // Import your custom CSS file for styling

export default function Heatmap({ data }) {
  const calculateHeight = (data) => {
    const dates = data.slice(1).map((row) => row[0]); // Extract dates
    const years = dates.map((date) => new Date(date).getFullYear());
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const numberOfYears = maxYear - minYear + 1;
    return 50 + numberOfYears * 150; // Approximate 150px per year
  };
  const dynamicHeight = calculateHeight(data);
  const options = {
    title: "Acceptance graph",
    calendar: {
      monthOutlineColor: {
        strokeOpacity: 0,
        strokeWidth: 0,
      },
      unusedMonthOutlineColor: {
        strokeOpacity: 0,
        strokeWidth: 0,
      },
      cellColor: {
        stroke: "black",
        strokeOpacity: 0.5,
        strokeWidth: 2,
      },
    },
    noDataPattern: {
      backgroundColor: "#e9eaf0",
      color: "#e9eaf0",
    },
    colorAxis: {
      colors: ["#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
      minValue: 0,
      maxValue: 5,
    },
    tooltip: {
      isHtml: true,
    },
  };
  if (data.length === 1) {
    return (
      <div className="heatmap-chart-container chart-container">
        <h1>NO PROBLEM DATA FOUND</h1>
      </div>
    );
  }
  return (
    <div className="heatmap-container">
      <Chart
        className="heatmap"
        chartType="Calendar"
        width="950px"
        height={`${dynamicHeight}px`}
        data={data}
        options={options}
      />
    </div>
  );
}
