import { Chart } from "react-google-charts";
import "./chart.css";
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
    backgroundColor: "#22252c", // Background color of the chart
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
      0: { pointSize: 4, color: "#05fff7" },
      1: { pointSize: 4, color: "#fc0303" },
      2: { pointSize: 4, color: "#03fc07" },
      3: { pointSize: 4, color: "#e3fc03" },
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
  if (data.length === 1) {
    return (
      <div className="line-chart-container chart-container">
        <h1>NO CONTEST DATA FOUND</h1>
      </div>
    );
  }
  return (
    <div className="line-chart-container chart-container">
      <Chart
        chartType="LineChart"
        width="100%"
        height="500px"
        data={data}
        options={option}
      />
    </div>
  );
}
