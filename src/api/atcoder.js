async function fetchContestData(handle) {
  try {
    const response = await fetch(
      `https://thingproxy.freeboard.io/fetch/https://atcoder.jp/users/${handle}/history/json`
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
async function fetchProblemSolvedData(handle) {
  try {
    const response = await fetch(
      `https://thingproxy.freeboard.io/fetch/https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user=${handle}`
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
module.exports = { fetchContestData, fetchProblemSolvedData };
