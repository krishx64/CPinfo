const { LeetCode } = require("leetcode-query");
const leetcode = new LeetCode();
async function fetchContestData(handle) {
  try {
    const response = await leetcode.user_contest_info(handle);
    return response;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
async function fetchProblemData(handle) {
  try {
    const response = await leetcode.user(handle);
    return response;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}

// import fetch from "node-fetch";

async function fetchYearCalendar(username, year) {
  const query = `
    query userProfileCalendar($username: String!, $year: Int) {
      matchedUser(username: $username) {
        userCalendar(year: $year) {
          submissionCalendar
        }
      }
    }
  `;
  const variables = { username, year };
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  const submissionCalendar =
    json.data.matchedUser.userCalendar.submissionCalendar;
  return JSON.parse(submissionCalendar);
}

async function fetchActiveYears(username) {
  const query = `
    query userProfileCalendar($username: String!) {
      matchedUser(username: $username) {
        userCalendar {
          activeYears
        }
      }
    }
  `;
  const variables = { username };
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  return json.data.matchedUser.userCalendar.activeYears;
}

async function fetchSubmissionCalendar(username) {
  const years = await fetchActiveYears(username);
  const allCalendar = {};

  for (const year of years) {
    const yearData = await fetchYearCalendar(username, year);
    for (const [ts, count] of Object.entries(yearData)) {
      //   const date = new Date(Number(ts) * 1000).toISOString().slice(0, 10);
      allCalendar[ts] = (allCalendar[ts] || 0) + count;
    }
  }
  return allCalendar;
}

module.exports = {
  fetchContestData,
  fetchProblemData,
  fetchSubmissionCalendar,
};
