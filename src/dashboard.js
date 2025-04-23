import React, { use } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useEffect, useState } from "react";
import "./dashboard.css";
import PieChart from "./chart_components/PieChart.js";
import LineChart from "./chart_components/lineChart.js";
import axios from "axios";
import Heatmap from "./chart_components/heatmap.js";
import ColumnChart from "./chart_components/columnChart.js";
import { useParams, useNavigate } from "react-router-dom";
import BASE_URL from "./config";

export default function Dashboard() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [handle, setHandle] = useState("");
  const { username } = useParams();
  const [errorLog, setErrorLog] = useState([]);
  const [data, setData] = useState({ userStats: [] });
  const [heatmapData, setHeatmapData] = useState([]);
  const [solvedRatings, setSolvedRatings] = useState([["Rating", "Solved"]]);
  const [difficultyRatings, setDifficultyRatings] = useState([
    ["Difficulty", "Solved"],
  ]);
  const [solvedProblems, setSolvedProblems] = useState(new Map());
  const [tags, setTags] = useState([]);
  const [contestRatings, setContestRatings] = useState([["Time"]]);
  const [sum, setSum] = useState(0);
  const [selectedView, setSelectedView] = useState("all");
  const [activeButton, setActiveButton] = useState("all");
  const [resources, setResources] = useState([]);
  useEffect(() => {
    const fetchResources = () => {
      axios
        .get(`${BASE_URL}/api/resources/${username}`)
        .then((response) => setData(response.data || { userStats: [] }))
        .catch((error) => {
          navigate("/");
          console.error("Error fetching data", error);
        });
    };
    // const fetchErrorLogs = () => {
    //   axios
    //     .get("http://localhost:3000/api/resources/errors")
    //     .then((response) => setErrorLog(response.data))
    //     .catch((error) => console.error("Error fetching data", error));
    // };

    // Fetch resources immediately when the component mounts
    const fetchAllData = () => {
      fetchResources();
      // fetchErrorLogs();
    };

    fetchAllData();

    // Set up an interval to fetch resources every 1 seconds
    const intervalId = setInterval(fetchAllData, 10000);

    // // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    let newSolvedProblems = new Map();
    let newSum = 0;
    let newFullName = "";
    data.userStats.forEach((resource) => {
      newSolvedProblems.set(resource.platform.toLowerCase(), resource.solved);
      newSum += resource.solved;
    });
    if (data.firstName !== undefined) {
      let { firstName, lastName } = data;
      newFullName =
        firstName[0].toUpperCase() +
        firstName.slice(1).toLowerCase() +
        " " +
        lastName[0].toUpperCase() +
        lastName.slice(1).toLowerCase();
    }
    handleButtonClick(selectedView);
    unstable_batchedUpdates(() => {
      setFullName(newFullName);
      setSolvedProblems(newSolvedProblems);
      setSum(newSum);
    });
  }, [data]);
  useEffect(() => {
    let newContestRatings = [["Time"]];
    let newHandle = "";
    let newHeatmapData = [
      [
        { type: "date", id: "Date" },
        { type: "number", id: "Solved" },
      ], // Add column definitions here
    ];
    let newTags = [];
    let newSolvedRatings = [["Rating", "Solved"]];
    let newDifficultyRatings = [["Difficulty", "Solved"]];
    resources.forEach((resource) => {
      newHandle = resource.handle;
      const Contests = resource.ratings;
      if (Contests.length === 0) return false;
      for (let i = 1; i < newContestRatings.length; i++) {
        newContestRatings[i].push(null);
      }
      newContestRatings[0].push(resource.platform);
      for (let i = 0; i < Contests.length; i++) {
        let temp = [new Date(Contests[i][0])];
        for (let j = 1; j <= newContestRatings[0].length - 2; j++) {
          temp.push(null);
        }
        temp.push(parseInt(Contests[i][1]));
        newContestRatings.push(temp);
      }
      if (resource.stats !== undefined) {
        let heatmapTemp = new Map();
        resource.stats.solved.forEach((problem) => {
          const dateKey = new Date(problem[0]);
          if (!heatmapTemp.has(dateKey)) {
            heatmapTemp.set(dateKey, 0);
          }
          heatmapTemp.set(
            dateKey,
            heatmapTemp.get(dateKey) + parseInt(problem[1])
          );
        });
        for (const [key, value] of heatmapTemp.entries()) {
          newHeatmapData.push([key, parseInt(value)]);
        }
        newTags.push(["Tags", "Solved"]);
        if (resource.stats.tags !== undefined) {
          resource.stats.tags.forEach((tag) => {
            newTags.push([tag[0], tag[1]]);
          });
        }
        if (resource.stats.rating !== undefined) {
          resource.stats.rating.forEach((rating) => {
            newSolvedRatings.push([rating[0], parseInt(rating[1])]);
          });
        }
        if (resource.stats.difficulty !== undefined) {
          resource.stats.difficulty.forEach((index) => {
            newDifficultyRatings.push([index[0], parseInt(index[1])]);
          });
        }
      }
    });
    unstable_batchedUpdates(() => {
      setHandle(newHandle);
      setSolvedRatings(newSolvedRatings);
      setDifficultyRatings(newDifficultyRatings);
      setTags(newTags);
      setHeatmapData(newHeatmapData);
      setContestRatings(newContestRatings);
    });
  }, [resources]);
  const handleButtonClick = (view) => {
    setSelectedView(view);
    switch (view) {
      case "all":
        setResources(data.userStats);
        setActiveButton("all");
        break;
      case "codeforces":
        const codeforcesData = [
          data.userStats.find((resource) => resource.platform === "Codeforces"),
        ];
        setResources(codeforcesData);
        setActiveButton("codeforces");
        break;
      case "codechef":
        const codechefData = [
          data.userStats.find((resource) => resource.platform === "Codechef"),
        ];
        setResources(codechefData);
        setActiveButton("codechef");
        break;
      case "atcoder":
        const atcoderData = [
          data.userStats.find((resource) => resource.platform === "Atcoder"),
        ];
        setResources(atcoderData);
        setActiveButton("atcoder");
        break;
      case "leetcode":
        const leetcodeData = [
          data.userStats.find((resource) => resource.platform === "Leetcode"),
        ];
        setResources(leetcodeData);
        setActiveButton("leetcode");
        break;
      default:
        setResources(data.userStats);
        setActiveButton("all");
        break;
    }
  };
  const renderView = () => {
    switch (selectedView) {
      case "all":
        return (
          <div>
            <LineChart data={contestRatings} />
            <Heatmap data={heatmapData} />
          </div>
        );
      case "codeforces":
        return (
          <div info-container>
            <h3>Handle: {handle}</h3>
            <LineChart data={contestRatings} />
            <PieChart data={tags} />
            {/* <div className="column-container"> */}
            <ColumnChart data={solvedRatings} title="Solved problem ratings" />
            <ColumnChart
              data={difficultyRatings}
              title="Solved problem difficulty"
            />
            {/* </div> */}
            <Heatmap data={heatmapData} />
          </div>
        );
      case "codechef":
        return (
          <div>
            <h3>Handle: {handle}</h3>
            <LineChart data={contestRatings} />
            <Heatmap data={heatmapData} />
          </div>
        );
      case "atcoder":
        return (
          <div>
            <h3>Handle: {handle}</h3>
            <LineChart data={contestRatings} />
            <ColumnChart
              data={difficultyRatings}
              title="Solved problem difficulty"
            />
            <Heatmap data={heatmapData} />
          </div>
        );
      case "leetcode":
        return (
          <div>
            <h3>Handle: {handle}</h3>
            <LineChart data={contestRatings} />
            <Heatmap data={heatmapData} />
          </div>
        );
      default:
        return null;
    }
  };
  if (data.username === undefined) return <div></div>;
  return (
    <div id="info-container">
      <h1>{fullName}</h1>
      <div className="button-container">
        <button
          className={
            activeButton === "all" ? "pressed-button" : "platform-button"
          }
          onClick={() => handleButtonClick("all")}
        >
          All: {sum}
        </button>
        <button
          className={
            solvedProblems.get("codeforces") !== undefined
              ? activeButton === "codeforces"
                ? "pressed-button"
                : "platform-button"
              : "disabled-button"
          }
          onClick={() =>
            solvedProblems.get("codeforces") !== undefined
              ? handleButtonClick("codeforces")
              : null
          }
        >
          {solvedProblems.get("codeforces") !== undefined
            ? `Codeforces: ${solvedProblems.get("codeforces")}`
            : "Codeforces"}
        </button>
        <button
          className={
            solvedProblems.get("codechef") !== undefined
              ? activeButton === "codechef"
                ? "pressed-button"
                : "platform-button"
              : "disabled-button"
          }
          onClick={() =>
            solvedProblems.get("codechef") !== undefined
              ? handleButtonClick("codechef")
              : null
          }
        >
          {solvedProblems.get("codechef") !== undefined
            ? `Codechef: ${solvedProblems.get("codechef")}`
            : "Codechef"}
        </button>
        <button
          className={
            solvedProblems.get("atcoder") !== undefined
              ? activeButton === "atcoder"
                ? "pressed-button"
                : "platform-button"
              : "disabled-button"
          }
          onClick={() =>
            solvedProblems.get("atcoder") !== undefined
              ? handleButtonClick("atcoder")
              : null
          }
        >
          {solvedProblems.get("atcoder") !== undefined
            ? `Atcoder: ${solvedProblems.get("atcoder")}`
            : "Atcoder"}
        </button>
        <button
          className={
            solvedProblems.get("leetcode") !== undefined
              ? activeButton === "leetcode"
                ? "pressed-button"
                : "platform-button"
              : "disabled-button"
          }
          onClick={() =>
            solvedProblems.get("leetcode") !== undefined
              ? handleButtonClick("leetcode")
              : null
          }
        >
          {solvedProblems.get("leetcode") !== undefined
            ? `Leetcode: ${solvedProblems.get("leetcode")}`
            : "Leetcode"}
        </button>
        {renderView()}
      </div>
      {/* {errorLog.length > 0 && (
        <div className="error-log">
          <h3>Error Log:</h3>
          <ul>
            {errorLog.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}{" "} */}
    </div>
  );
}
