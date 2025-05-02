import React, { use } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { useEffect, useState } from "react";
import "./dashboard.css";
import PieChart from "./chart_components/PieChart.js";
import LineChart from "./chart_components/lineChart.js";
import BarChart from "./chart_components/barChart.js";
import axios from "axios";
import Heatmap from "./chart_components/heatmap.js";
import ColumnChart from "./chart_components/columnChart.js";
import { useParams, useNavigate } from "react-router-dom";
import "./login.css";
import BASE_URL from "./config";

function calculateLeague(platform, rating) {
  switch (platform) {
    case "Codeforces": {
      if (rating <= 1199) return "Newbie";
      if (rating <= 1399) return "Pupil";
      if (rating <= 1599) return "Specialist";
      if (rating <= 1899) return "Expert";
      if (rating <= 2099) return "Candidate Master";
      if (rating <= 2299) return "Master";
      if (rating <= 2399) return "International Master";
      if (rating <= 2599) return "Grandmaster";
      if (rating <= 2899) return "International Grandmaster";
      return "Legendary Grandmaster";
    }
    case "Codechef": {
      if (rating < 1400) return "1 Star";
      if (rating < 1600) return "2 Star";
      if (rating < 1800) return "3 Star";
      if (rating < 2000) return "4 Star";
      if (rating < 2200) return "5 Star";
      if (rating < 2500) return "6 Star";
      return "7 Star";
    }
    case "Atcoder": {
      if (rating < 400) return "Gray";
      if (rating < 800) return "Brown";
      if (rating < 1200) return "Green";
      if (rating < 1600) return "Cyan";
      if (rating < 2000) return "Blue";
      if (rating < 2400) return "Yellow";
      if (rating < 2800) return "Orange";
      return "Red";
    }
    // case "Leetcode": {
    //   if (rating < 1400) return "Bronze";
    //   if (rating < 1600) return "Silver";
    //   if (rating < 1800) return "Gold";
    //   if (rating < 2000) return "Platinum";
    //   if (rating < 2200) return "Diamond";
    //   return "Challenger";
    // }
    default:
      return "Unranked";
  }
}
function calculateStreaks(heatmapData) {
  if (heatmapData.length <= 1) {
    // No data or only column definitions
    return { maxStreak: 0, currentStreak: 0 };
  }

  // Extract only the dates from heatmapData (skip the first row if it's column definitions)
  const dates = heatmapData.slice(1).map((entry) => new Date(entry[0]));

  // Sort dates in ascending order
  dates.sort((a, b) => a - b);

  let maxStreak = 0;
  let currentStreak = 1; // Start with 1 since the first day is always part of a streak
  for (let i = 1; i < dates.length; i++) {
    const prevDate = dates[i - 1];
    const currentDate = dates[i];

    // Check if the current date is consecutive to the previous date
    const diffInDays = (currentDate - prevDate) / (1000 * 60 * 60 * 24); // Difference in days
    if (diffInDays <= 1) {
      currentStreak++;
    } else {
      // Update max streak if the current streak ends
      maxStreak = Math.max(maxStreak, currentStreak);
      currentStreak = 1; // Reset current streak
    }
  }

  // Final check for the last streak
  maxStreak = Math.max(maxStreak, currentStreak);

  // Calculate current streak (from the last active day to today)
  const today = new Date();
  const lastActiveDate = dates[dates.length - 1];
  const diffFromToday = (today - lastActiveDate) / (1000 * 60 * 60 * 24);
  if (diffFromToday < 1) {
    // If the last active day is today, the current streak continues
    return { maxStreak, currentStreak };
  } else {
    // Otherwise, the current streak ends
    return { maxStreak, currentStreak: 0 };
  }
}
export default function Dashboard() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [user, setUser] = useState("");
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
  const [error, setError] = useState(false);
  const [maxStreak, setMaxStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(1);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchResources = () => {
      axios
        .get(`${BASE_URL}/api/resources/${username}`)
        .then((response) => setData(response.data || { userStats: [] }))
        .catch((error) => {
          console.error("Error fetching data", error);
          setError(error);
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
    // const intervalId = setInterval(fetchAllData, 10000);

    // // Cleanup the interval when the component unmounts
    // return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    let newSolvedProblems = new Map();
    let newSum = 0;
    let newFullName = "";
    let newUser = "";
    data.userStats.forEach((resource) => {
      newSolvedProblems.set(resource.platform.toLowerCase(), resource.solved);
      newSum += resource.solved;
    });
    if (data.firstName !== undefined) {
      let { firstName, lastName } = data;
      newUser = data.username;
      newFullName =
        firstName[0].toUpperCase() +
        firstName.slice(1).toLowerCase() +
        " " +
        lastName[0].toUpperCase() +
        lastName.slice(1).toLowerCase();
    }
    handleButtonClick(selectedView);
    unstable_batchedUpdates(() => {
      setUser(newUser);
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
    let heatmapTemp = new Map();
    let newTotalSolved = 0;
    let newTotalSubmissions = 0;
    let newRatings = [];
    resources.forEach((resource) => {
      if (resource.maxRating) {
        newRatings.push({
          platform: resource.platform,
          maxRating: resource.maxRating,
          currentRating: resource.currentRating,
          league: resource.stats.league,
        });
      }
      newHandle = resource.handle;
      newTotalSolved += resource.solved;
      newTotalSubmissions += resource.totalSubmissions;
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
        resource.stats.solved.forEach((problem) => {
          let dateKey = new Date(problem[0]);
          const localDate = new Date(problem[0] * 1000);
          const year = localDate.getFullYear();
          const month = String(localDate.getMonth() + 1).padStart(2, "0");
          const day = String(localDate.getDate()).padStart(2, "0");
          dateKey = `${year}-${month}-${day}`;
          if (!heatmapTemp.has(dateKey)) {
            heatmapTemp.set(dateKey, 0);
          }
          heatmapTemp.set(
            dateKey,
            heatmapTemp.get(dateKey) + parseInt(problem[1])
          );
        });
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
    for (const [key, value] of heatmapTemp.entries()) {
      newHeatmapData.push([new Date(key), parseInt(value)]);
    }
    unstable_batchedUpdates(() => {
      setRatings(newRatings);
      setHandle(newHandle);
      setTotalSolved(newTotalSolved);
      setTotalSubmissions(newTotalSubmissions);
      setSolvedRatings(newSolvedRatings);
      setDifficultyRatings(newDifficultyRatings);
      setTags(newTags);
      setHeatmapData(newHeatmapData);
      setContestRatings(newContestRatings);
    });
  }, [resources]);
  useEffect(() => {
    if (heatmapData.length > 1) {
      const { maxStreak, currentStreak } = calculateStreaks(heatmapData);
      setMaxStreak(maxStreak);
      setCurrentStreak(currentStreak);
    }
  }, [heatmapData]);
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
    if (data.userStats.length === 0)
      return (
        <div>
          <h2>{"No Data Found :("}</h2>
          <h2>
            {"If this is your account, you can update your handle in settings"}
          </h2>
        </div>
      );
    switch (selectedView) {
      case "all":
        let solvedPlatforms = [["Platform", "Solved"]];
        solvedPlatforms.push(...Array.from(solvedProblems));
        return (
          <div>
            <div className="other-info-container">
              <BarChart data={solvedPlatforms} />
              <div className="column-container">
                <div className="row-card-container">
                  {ratings.map((platform, index) => (
                    <div key={index}>
                      <div className="stat-name">{platform.platform}</div>
                      <div className="stat-value">
                        {parseInt(platform.currentRating)}
                      </div>
                      <div className="stat-value-small">
                        (max : {parseInt(platform.maxRating)})
                      </div>
                      <div className="stat-value-league">
                        {platform.platform === "Leetcode"
                          ? platform.league
                          : calculateLeague(
                              platform.platform,
                              platform.currentRating
                            )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="row-card-container">
                  <div>
                    <div className="stat-name">Solved</div>
                    <div className="stat-value">{sum}</div>
                  </div>
                  {"|"}
                  <div>
                    <div className="stat-name">Active Days</div>
                    <div className="stat-value">{heatmapData.length - 1}</div>
                  </div>
                  {"|"}
                  <div>
                    <div className="stat-name">Contests Given</div>
                    <div className="stat-value">
                      {contestRatings.length - 1}
                    </div>
                  </div>
                  {"|"}
                  <div>
                    <div className="stat-name">Max Streak</div>
                    <div className="stat-value">{maxStreak}</div>
                  </div>
                  {"|"}
                  <div>
                    <div className="stat-name">Current Streak</div>
                    <div className="stat-value">{currentStreak}</div>
                  </div>
                  {"|"}
                  <div>
                    <div className="stat-name">Success Rate</div>
                    <div className="stat-value">
                      {((totalSolved / totalSubmissions || 1) * 100).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
  if (error) {
    return (
      <div className="login-container">
        <h1>Error</h1>
      </div>
    );
  } else if (data.username === undefined)
    return (
      <div className="login-container">
        <h1>Loading...</h1>
      </div>
    );
  return (
    <div id="info-container">
      <h1>{fullName}</h1>
      <h4>@{user}</h4>
      <div className="info-window-container">
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
        {/* <div className="other-info-container">
          <div className="column-container">
            <div className="row-card-container"></div>
            <div className="row-card-container">
              <div>
                <div className="stat-name">Solved</div>
                <div className="stat-value">{totalSolved}</div>
              </div>
              {"|"}
              <div>
                <div className="stat-name">Active Days</div>
                <div className="stat-value">{heatmapData.length - 1}</div>
              </div>
              {"|"}
              <div>
                <div className="stat-name">Contests Given</div>
                <div className="stat-value">{contestRatings.length - 1}</div>
              </div>
              {"|"}
              <div>
                <div className="stat-name">Max Streak</div>
                <div className="stat-value">{maxStreak}</div>
              </div>
              {"|"}
              <div>
                <div className="stat-name">Current Streak</div>
                <div className="stat-value">{currentStreak}</div>
              </div>
              {"|"}
              <div>
                <div className="stat-name">Success Rate</div>
                <div className="stat-value">
                  {((totalSolved / totalSubmissions || 1) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {renderView()}
      </div>
    </div>
  );
}
