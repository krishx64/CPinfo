import React, { useEffect, useRef, useState } from "react";
import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import "cal-heatmap/cal-heatmap.css";
import "./cal-heatmap-custom.css"; // Import your custom CSS file for styling

export default function CalResponsive({ data }) {
  console.log(data);
  const calRef = useRef(null); //store a reference to CalHeatmap instance
  if (calRef.current) {
    calRef.current.destroy(); //destroy the previous instance if it exists
  }
  const cal = new CalHeatmap(); //create a new instance of CalHeatmap
  cal.paint(
    {
      // theme: "dark",
      range: 10,
      verticalOrientation: true,
      date: {
        start: new Date("2020-01-01"),
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
          range: ["#edf8e9", "#bae4b3", "#74c476", "#31a354", "#006d2c"],
          type: "quantize",
          domain: [0, 3],
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
              ? value + " problems"
              : "No data" + " on " + dayjsDate.format("LL");
          },
        },
      ],
    ]
  );
  calRef.current = cal; //store the new instance in the ref
  //   const calRef = useRef(null); //store a reference to CalHeatmap instance
  //   const [sideLength, setSideLength] = useState(0);
  //   const low = -1.1;
  //   const high = 21.1;
  //   const gutterSize = 4;
  //   const months = 12;

  //   const updateDimensions = () => {
  //     const parentDiv = document.getElementById("parent-div");
  //     const numberOfRows = 7; //7 days in a week

  //     /*
  //             Decent approximate using average days in a month (30.5 days)
  //             until can figure out how to do exact calculation
  //         */
  //     const numberOfColumns = Math.ceil((months * 30.5) / numberOfRows);

  //     const totalGutterWidth = gutterSize * (numberOfColumns - 1);
  //     if (parentDiv) {
  //       const parentWidth = parentDiv?.offsetWidth;
  //       const newSideLength = (parentWidth - totalGutterWidth) / numberOfColumns;
  //       setSideLength(newSideLength);
  //     }
  //   };

  //   useEffect(() => {
  //     updateDimensions();
  //   }, []);

  //   useEffect(() => {
  //     //only create/paint the calendar if the side length has been calculated
  //     if (sideLength > 0) {
  //       window.addEventListener("resize", updateDimensions);

  //       if (calRef.current) {
  //         document.getElementById("cal-heatmap").innerHTML = "";
  //       }

  //       const cal = new CalHeatmap();
  //       cal.paint(
  //         {
  //           data: {
  //             source: "../data/seattle-weather.json",
  //             type: "json",
  //             x: "date",
  //             y: (d) => +d["temp_max"],
  //             groupY: "max",
  //           },
  //           range: months,
  //           animationDuration: 0,
  //           date: { start: new Date("2012-01-01") },
  //           scale: {
  //             color: {
  //               type: "quantize",
  //               domain: [low, high],
  //               scheme: "YlOrRd",
  //             },
  //           },
  //           domain: {
  //             type: "year",
  //             gutter: gutterSize,
  //             label: { text: "MMM", textAlign: "start", position: "top" },
  //           },
  //           subDomain: {
  //             type: "month",
  //             radius: 2,
  //             width: sideLength,
  //             height: sideLength,
  //             gutter: gutterSize,
  //           },
  //         },
  //         [
  //           [
  //             Tooltip,
  //             {
  //               text: function (date, value, dayjsDate) {
  //                 return (
  //                   (value ? value + " ℃" : "No data") +
  //                   " on " +
  //                   dayjsDate.format("LL")
  //                 );
  //               },
  //             },
  //           ],
  //         ]
  //       );
  //       calRef.current = cal;

  //       //remove event listener when the component unmounts
  //       return () => window.removeEventListener("resize", updateDimensions);
  //     }
  //   }, [sideLength]);

  return <div id="cal-heatmap"></div>;
}
