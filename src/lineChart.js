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
    hAxis: { title: "Time" },
    vAxis: { title: "Popularity" },
    legend: "none",
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
