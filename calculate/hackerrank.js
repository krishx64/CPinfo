const { fetchProblemData } = require("../api/hackerrank");

async function calculate_HR_stats(handle) {
  try {
    let data = await fetchProblemData(handle);
    let stats = {
      solved: [],
    };
    let { models, cursor, last_page } = data;
    stats.solved = data.models;
    while (!last_page) {
      data = await fetchProblemData(handle, cursor);
      ({ models, cursor, last_page } = data);
      stats.solved.push(...data.models);
    }
    stats.solved = stats.solved.map((solved) => {
      const isoString = solved.created_at;
      const epochSeconds = Math.floor(new Date(isoString).getTime() / 1000);
      return [epochSeconds, 1];
    });
    let totalSubmissions = stats.solved.length;
    let totalSolved = totalSubmissions;
    return { stats, totalSubmissions, totalSolved };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

module.exports = { calculate_HR_stats };
