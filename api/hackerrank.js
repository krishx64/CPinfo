async function fetchProblemData(handle, cursor = null) {
  try {
    const response = await fetch(
      `https://www.hackerrank.com/rest/hackers/${handle}/recent_challenges?limit=20&cursor=${cursor}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}
module.exports = { fetchProblemData };
