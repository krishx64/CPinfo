async function fetchContestData(handle) {
  try {
    const response = await fetch(
      `https://codeforces.com/api/user.rating?handle=${handle}`
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
      `https://codeforces.com/api/user.status?handle=${handle}&from=1`
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
