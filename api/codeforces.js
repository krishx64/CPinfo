async function fetchContestData(handle) {
  try {
    const response = await fetch(
      `https://codeforces.com/api/user.rating?handle=${handle}`
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
      `https://codeforces.com/api/user.status?handle=${handle}&from=1`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
module.exports = { fetchContestData, fetchProblemData };
