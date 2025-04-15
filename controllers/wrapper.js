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
      const solved = await solvedfn(handle);
      const rating = await ratingfn(handle);
      const stats = await statsfn(handle);
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
