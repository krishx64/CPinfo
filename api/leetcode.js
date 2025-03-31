async function fetchContestData(handle) {
  try {
    const response = await fetch(
      `https://alfa-leetcode-api.onrender.com/${handle}/contest`
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
      `https://alfa-leetcode-api.onrender.com/${handle}/solved`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
module.exports = { fetchContestData, fetchProblemData };
