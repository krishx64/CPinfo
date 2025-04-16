import React, { useEffect, useRef, useState } from "react";
import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import "cal-heatmap/cal-heatmap.css";
import "./cal-heatmap-custom.css"; // Import your custom CSS file for styling

export default function CalResponsive({ data }) {
  console.log(data);
  let min_date = null;
  let max_date = null;
  data.forEach((item) => {
    if (item.date === null) return false;
    const date = new Date(item.date);
    if (min_date === null || date < min_date) {
      min_date = date;
    }
    if (max_date === null || date > max_date) {
      max_date = date;
    }
  });
  let years = 0;
  if (min_date !== null && max_date !== null) {
    years = max_date.getFullYear() - min_date.getFullYear() + 1;
  }
  const calRef = useRef(null); //store a reference to CalHeatmap instance
  if (calRef.current) {
    calRef.current.destroy(); //destroy the previous instance if it exists
  }
  const cal = new CalHeatmap(); //create a new instance of CalHeatmap
  cal.paint(
    {
      // theme: "dark",
      range: years,
      verticalOrientation: true,
      date: {
        start: min_date,
      },
      domain: {
        type: "year",
        dynamicDimension: true,
        gutter: 20,
        label: {
          text: "YYYY",
          textAlign: "start",
          position: "left",
          rotate: "left",
        },
      },
      subDomain: {
        type: "day",
        width: 15,
        height: 15,
      },
      scale: {
        color: {
          range: ["#bae4b3", "#74c476", "#31a354", "#006d2c"],
          type: "quantize",
          domain: [0, 4],
        },
      },
      data: {
        source: data,
        x: "date",
        y: "count",
      },
    },
    [
      [
        Tooltip,
        {
          text: function (date, value, dayjsDate) {
            return value
              ? value + " problems" + " on " + dayjsDate.format("LL")
              : "No data" + " on " + dayjsDate.format("LL");
          },
        },
      ],
    ]
  );
  calRef.current = cal; //store the new instance in the ref
  return <div id="cal-heatmap"></div>;
}
