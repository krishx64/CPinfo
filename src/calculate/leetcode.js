function calculate_LC_contestRatings(Contests, contestRatings) {
  for (let i = 1; i < contestRatings.length; i++) {
    contestRatings[i].push(null);
  }
  contestRatings[0].push("Leetcode");
  for (let i = 0; i < Contests.length; i++) {
    let temp = [new Date(Contests[i].contest.startTime * 1000)];
    for (let j = 1; j <= contestRatings[0].length - 2; j++) {
      temp.push(null);
    }
    temp.push(parseInt(Contests[i].rating));
    contestRatings.push(temp);
  }
  return contestRatings;
}
module.exports = { calculate_LC_contestRatings };
