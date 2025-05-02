const User = require("../models/user"); // your User model
const redisClient = require("../db/redis.js");

async function addInfo(
  username,
  solvedfn,
  ratingfn,
  platform,
  handle,
  errorLog,
  statsfn
) {
  try {
    if (!handle) {
      // Remove that platform's stat from userStats
      await User.updateOne(
        { username },
        { $pull: { userStats: { platform } } }
      );
    } else {
      let solved = [];
      let contestRatings = [];
      let maxRating = 0;
      let currentRating = 0;
      let stats = {};
      let totalSubmissions = 0;

      try {
        solved = await solvedfn(handle);
      } catch (error) {
        errorLog.errorArray.push(
          `Failed to fetch solved problems for ${platform}`
        );
        console.error("Error in solvedfn:", error);
      }

      try {
        ({ contestRatings, maxRating, currentRating } = await ratingfn(handle));
      } catch (error) {
        errorLog.errorArray.push(`Failed to fetch ratings for ${platform}`);
        console.error("Error in ratingfn:", error);
      }

      try {
        ({ stats, totalSubmissions } = await statsfn(handle, username));
      } catch (error) {
        errorLog.errorArray.push(`Failed to fetch stats for ${platform}`);
        console.error("Error in statsfn:", error);
      }

      // Try to update the existing platform data
      const result = await User.updateOne(
        { username, "userStats.platform": platform },
        {
          $set: {
            "userStats.$.handle": handle,
            "userStats.$.solved": solved,
            "userStats.$.totalSubmissions": totalSubmissions,
            "userStats.$.ratings": contestRatings,
            "userStats.$.maxRating": maxRating,
            "userStats.$.currentRating": currentRating,
            "userStats.$.stats": stats,
          },
        }
      );

      // If that platform entry doesn't exist, push it as a new one
      if (result.matchedCount === 0) {
        await User.updateOne(
          { username },
          {
            $push: {
              userStats: {
                platform,
                handle,
                solved,
                totalSubmissions,
                ratings: contestRatings,
                maxRating,
                currentRating,
                stats,
              },
            },
          }
        );
      }
    }
  } catch (error) {
    errorLog.errorArray.push(
      `There was an error with ${platform}, some info are not updated`
    );
    console.error("Error in addInfo:", error);
  }
  try {
    const response = await User.findOne({ username: username }).select(
      "-password"
    );
    await redisClient.setEx(username, 600, JSON.stringify(response));
  } catch (error) {
    console.error("Error in redis:", error);
    throw error;
  }
}
module.exports = { addInfo };
