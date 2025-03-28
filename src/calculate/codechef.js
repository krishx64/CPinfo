function calculate_CC_contestRatings(Contests, contestRatings) {
  for (let i = 1; i < contestRatings.length; i++) {
    contestRatings[i].push(null);
  }
  contestRatings[0].push("Codechef");
  for (let i = 0; i < Contests.length; i++) {
    let someDate = new Date(Contests[i].end_date);
    someDate = someDate.getTime();
    let temp = [new Date(someDate)];
    for (let j = 1; j <= contestRatings[0].length - 2; j++) {
      temp.push(null);
    }
    temp.push(parseInt(Contests[i].rating));
    contestRatings.push(temp);
  }
  return contestRatings;
}
module.exports = { calculate_CC_contestRatings };
