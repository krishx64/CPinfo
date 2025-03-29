import axios from "axios";
export async function fetchContestData(handle) {
  try {
    const response = await fetch(
      `https://codechef-api.vercel.app/handle/${handle}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
  }
}
export async function fetchSolvedCount(username) {
  try {
    const axiosResponse = await axios.request({
      method: "GET",
      url: `https://thingproxy.freeboard.io/fetch/https://www.codechef.com/users/${username}`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    });
    const match = axiosResponse.data.match(/Total Problems Solved:\s*(\d+)/);
    return parseInt(match[1]);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return null;
  }
}
// module.exports = { fetchContestData, fetchSolvedCount };
