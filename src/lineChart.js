import { Chart } from "react-google-charts";
export default function LineChart({ data }) {
  const optionPie = {
    title: "Submissions",
  };
  return (
    <div>
      <Chart
        chartType="PieChart"
        data={data}
        options={optionPie}
        width={"100%"}
        height={"400px"}
      />
    </div>
  );
}
