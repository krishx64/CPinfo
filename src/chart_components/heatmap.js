import React from "react";
import { Chart } from "react-google-charts";
import "./heatmap.css"; // Import your custom CSS file for styling
import { color } from "chart.js/helpers";

export const options = {
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
      stroke: "black", // Color the border of the squares.
      strokeOpacity: 0.5, // Make the borders half transparent.
      strokeWidth: 2, // ...and two pixels thick.
    },
  },
  noDataPattern: {
    backgroundColor: "#FFFFFF",
    color: "#FFFFFF",
  },
  colorAxis: {
    colors: ["#bae4b3", "#74c476", "#31a354", "#006d2c"],
    minValue: 0,
    maxValue: 4,
  },
  tooltop: {
    isHtml: false,
    trigger: "focus",
  },
};
export default function Heatmap({ data }) {
  console.log(data);
  return (
    <div className="heatmap-container">
      <Chart
        chartType="Calendar"
        width="1000px"
        height="1000px"
        data={data}
        options={options}
      />
    </div>
  );
}
