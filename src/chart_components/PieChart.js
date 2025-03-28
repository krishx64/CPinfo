import { Chart } from "react-google-charts";
export default function PieChart({ data }) {
  const options = {
    title: "Total submissions",
    pieHole: 0.4,
    is3D: false,
    backgroundColor: "#28282B",
    titleTextStyle: {
      color: "#FFFFFF", // Title text color
      fontSize: 18,
      bold: true,
    },
    legend: {
      textStyle: {
        color: "#FFFFFF", // Legend text color
        fontSize: 14,
      },
    },
  };
  return (
    <div>
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"1000px"}
        height={"400px"}
      />
    </div>
  );
}
