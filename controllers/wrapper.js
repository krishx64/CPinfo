const SolvedProblemCount = require("../models/Solved.js");
async function addSolvedProblemCount(
  solvedfn,
  ratingfn,
  platform,
  handle,
  errorArray
) {
  try {
    const solved = await solvedfn(handle);
    const rating = await ratingfn(handle);
    await SolvedProblemCount.findOneAndUpdate(
      { name: platform },
      { handle: handle, solved: solved, ratings: rating },
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    );
  } catch (error) {
    errorArray.push(
      `There was an error with ${platform}, some info are not updated`
    );
    console.error("Error in addSolvedProblemCount:", error);
  }
}
module.exports = { addSolvedProblemCount };
