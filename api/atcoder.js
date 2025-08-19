/**
 * AtCoder API utilities for fetching user contest history, solved count, and submission data.
 *
 * Exports:
 *   - fetchContestData: Fetches user contest history.
 *   - fetchProblemSolvedCount: Fetches the total number of problems solved by a user.
 *   - fetchProblemData: Fetches all submission data for a user.
 */

/**
 * Fetches AtCoder user's contest history.
 * @param {string} handle - AtCoder username.
 * @returns {Promise<Object[]>} Array of contest history objects.
 */
async function fetchContestData(handle) {
  try {
    const response = await fetch(
      `https://atcoder.jp/users/${handle}/history/json`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}

/**
 * Fetches the total number of problems solved by a user on AtCoder.
 * @param {string} handle - AtCoder username.
 * @returns {Promise<Object>} Object containing solved count and user info.
 */
async function fetchProblemSolvedCount(handle) {
  try {
    const response = await fetch(
      `https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user=${handle}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
  }
}

/**
 * Fetches all submission data for a user from a given time.
 * @param {string} handle - AtCoder username.
 * @param {number} time - Unix timestamp (seconds) to fetch submissions from.
 * @returns {Promise<Object[]>} Array of submission objects.
 */
async function fetchProblemData(handle, time) {
  try {
    const response = await fetch(
      `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${handle}&from_second=${time}`
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
