import { Chart } from "react-google-charts";
import "./linechart.css"; // Import your custom CSS file for styling
export default function LineChart({ data }) {
  const option = {
    title: "Contest Ratings",
    interpolateNulls: true,
    explorer: {
      axis: "horizontal",
      keepInBounds: true,
      maxZoomIn: 0.1,
      maxZoomOut: 1,
      zoomDelta: 1.1,
    },
    backgroundColor: "#28282B", // Background color of the chart
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
      minValue: 0,
    },
    series: {
      0: { pointSize: 5 }, // Dataset 1 with visible points
      1: { pointSize: 5 }, // Dataset 2 with visible points
      2: { pointSize: 5 },
      3: { pointSize: 5 },
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
    <div className="line-chart-container">
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={data}
        options={option}
      />
    </div>
  );
}
