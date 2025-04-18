async function fetchContestData(handle) {
  try {
    const response = await fetch(
      `https://thingproxy.freeboard.io/fetch/https://atcoder.jp/users/${handle}/history/json`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
async function fetchProblemSolvedCount(handle) {
  try {
    const response = await fetch(
      `https://thingproxy.freeboard.io/fetch/https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user=${handle}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
async function fetchProblemData(handle) {
  try {
    const response = await fetch(
      `https://thingproxy.freeboard.io/fetch/https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${handle}&from_second=0`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
module.exports = {
  fetchContestData,
  fetchProblemSolvedCount,
  fetchProblemData,
};
