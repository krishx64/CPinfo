const userInfo = require("../models/userInfo.js");
async function addInfo(
  solvedfn,
  ratingfn,
  platform,
  handle,
  errorLog,
  statsfn
) {
  try {
    if (handle === "") await userInfo.findOneAndDelete({ name: platform });
    else {
      let solved = [];
      let rating = [];
      let stats = {};

      // Execute each function with its own try-catch block
      try {
        solved = await solvedfn(handle);
      } catch (error) {
        errorLog.errorArray.push(
          `Failed to fetch solved problems for ${platform}`
        );
        console.error("Error in solvedfn:", error);
      }

      try {
        rating = await ratingfn(handle);
      } catch (error) {
        errorLog.errorArray.push(`Failed to fetch ratings for ${platform}`);
        console.error("Error in ratingfn:", error);
      }

      try {
        stats = await statsfn(handle);
      } catch (error) {
        errorLog.errorArray.push(`Failed to fetch stats for ${platform}`);
        console.error("Error in statsfn:", error);
      }
      await userInfo.findOneAndUpdate(
        { name: platform },
        { handle: handle, solved: solved, ratings: rating, stats: stats },
        {
          new: true,
          runValidators: true,
          upsert: true,
        }
      );
    }
  } catch (error) {
    errorLog.errorArray.push(
      `There was an error with ${platform}, some info are not updated`
    );
    console.error("Error in addInfo:", error);
  }
}
module.exports = { addInfo };
