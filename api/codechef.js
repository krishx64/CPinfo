const axios = require("axios");
async function fetchContestData(handle) {
  try {
    const response = await fetch(
      `https://codechef-api.vercel.app/handle/${handle}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
async function fetchSolvedCount(handle) {
  try {
    const axiosResponse = await axios.request({
      method: "GET",
      url: `https://thingproxy.freeboard.io/fetch/https://www.codechef.com/users/${handle}`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    });
    const match = axiosResponse.data.match(/Total Problems Solved:\s*(\d+)/);
    return parseInt(match[1]);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw new Error(error);
    return null;
  }
}
module.exports = { fetchContestData, fetchSolvedCount };
