import { Chart } from "react-google-charts";
export default function LineChart({ data }) {
  const dataL = [
    ["Time", "Dataset 1", "Dataset 2"], // Headers
    [0, 0, 0],
    [1, 15, null],
    [2, null, 12],
    [3, 30, null],
    [4, 20, 25],
    [5, null, 30],
    [6, 40, 15],
    [7, 50, 10],
    [8, 1000, null],
  ];
  const option = {
    title: "Contest Ratings",
    interpolateNulls: true,
    // backgroundColor: "#28282B", // Background color of the chart
    hAxis: {
      title: "Time",
      // textStyle: { color: "#FFFFFF" }, // X-axis text color
      // titleTextStyle: { color: "#FFFFFF", bold: true }, // X-axis title color
    },
    vAxis: {
      title: "Rating",
      // textStyle: { color: "#FFFFFF" }, // Y-axis text color
      // titleTextStyle: { color: "#FFFFFF", bold: true }, // Y-axis title color
    },
    series: {
      0: { color: "blue", pointSize: 5 }, // Dataset 1 with visible points
      1: { color: "red", pointSize: 5 }, // Dataset 2 with visible points
    },
    legend: "right",
    // titleTextStyle: {
    //   color: "#FFFFFF", // Title text color
    //   fontSize: 18,
    //   bold: true,
    // },
  };
  return (
    <div>
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
