async function fetchContestData(handle) {
  try {
    const response = await fetch(
      `https://alfa-leetcode-api.onrender.com/${handle}/contest`
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
async function fetchProblemData(handle) {
  try {
    const response = await fetch(
      `https://alfa-leetcode-api.onrender.com/${handle}/solved`
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
module.exports = { fetchContestData, fetchProblemData };
