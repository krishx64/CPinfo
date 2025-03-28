function calculate_AC_contestRatings(Contests, contestRatings) {
  for (let i = 1; i < contestRatings.length; i++) {
    contestRatings[i].push(null);
  }
  contestRatings[0].push("Atcoder");
  for (let i = 0; i < Contests.length; i++) {
    let someDate = new Date(Contests[i].EndTime);
    someDate = someDate.getTime();
    let temp = [new Date(someDate)];
    for (let j = 1; j <= contestRatings[0].length - 2; j++) {
      temp.push(null);
    }
    temp.push(parseInt(Contests[i].NewRating));
    contestRatings.push(temp);
  }
  return contestRatings;
}
module.exports = { calculate_AC_contestRatings };
