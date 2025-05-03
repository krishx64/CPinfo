import { Chart } from "react-google-charts";
import "./chart.css";
export default function PieChart({ data }) {
  const sortedData = data.map((row, index) => {
    if (index === 0) return row;
    return [`${row[0]}: ${row[1]}`, row[1]];
  });

  sortedData.sort((a, b) => b[1] - a[1]);
  const options = {
    title: "Tags of solved problems",
    chartArea: { width: "50%" },
    pieHole: 0.4,
    is3D: false,
    backgroundColor: "#22252c",
    titleTextStyle: {
      color: "#FFFFFF", // Title text color
      fontSize: 18,
      bold: true,
    },
    legend: {
      position: "right", // Position the legend on the right
      textStyle: {
        color: "#FFFFFF", // Legend text color
        fontSize: 14,
      },
      alignment: "center", // Align legend items
    },
    pieSliceText: "none",
  };
  if (data.length === 1) {
    return (
      <div className="pie-chart-container chart-container">
        <h1>NO DATA FOUND</h1>
      </div>
    );
  }
  return (
    <div className="pie-chart-container chart-container">
      <Chart
        chartType="PieChart"
        data={sortedData}
        options={options}
        width={"100%"}
        height={"600px"}
      />
    </div>
  );
}
