import { Chart } from "react-google-charts";
export default function LineChart() {
  const dataL = [
    ["x", "dogs"],
    [0, 0],
    [1, 10],
    [2, 23],
    [3, 17],
    [4, 18],
    [5, 9],
    [6, 11],
    [7, 27],
    [8, 33],
    [9, 40],
    [10, 32],
    [11, 35],
  ];
  const option = {
    title: "Line Chart Example",
    backgroundColor: "#28282B", // Background color of the chart
    hAxis: {
      title: "Time",
      textStyle: { color: "#FFFFFF" }, // X-axis text color
      titleTextStyle: { color: "#FFFFFF", bold: true }, // X-axis title color
    },
    vAxis: {
      title: "Popularity",
      textStyle: { color: "#FFFFFF" }, // Y-axis text color
      titleTextStyle: { color: "#FFFFFF", bold: true }, // Y-axis title color
    },
    legend: "none",
    titleTextStyle: {
      color: "#FFFFFF", // Title text color
      fontSize: 18,
      bold: true,
    },
  };
  return (
    <div>
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={dataL}
        options={option}
      />
    </div>
  );
}
