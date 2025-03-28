import { Chart } from "react-google-charts";
export default function LineChart({ data }) {
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
      0: { pointSize: 5 }, // Dataset 1 with visible points
      1: { pointSize: 5 }, // Dataset 2 with visible points
      2: { pointSize: 5 },
      3: { pointSize: 5 },
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
