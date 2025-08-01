const axios = require("axios");
const cheerio = require("cheerio");
const { JSDOM } = require("jsdom");
async function fetchContestData(handle) {
  try {
    const resdata = await fetch(`https://www.codechef.com/users/${handle}`);
    if (resdata.status == 200) {
      let d = await resdata.text();
      let data = { data: d };
      let heatMapDataCursour1 =
        data.data.search("var userDailySubmissionsStats =") +
        "var userDailySubmissionsStats =".length;
      let heatMapDataCursour2 = data.data.search("'#js-heatmap") - 34;
      let heatDataString = data.data.substring(
        heatMapDataCursour1,
        heatMapDataCursour2
      );
      let headMapData = JSON.parse(heatDataString);
      let allRating =
        data.data.search("var all_rating = ") + "var all_rating = ".length;
      let allRating2 = data.data.search("var current_user_rating =") - 6;
      let ratingData = JSON.parse(data.data.substring(allRating, allRating2));
      let dom = new JSDOM(data.data);
      let document = dom.window.document;
      return {
        success: true,
        status: resdata.status,
        profile: document.querySelector(".user-details-container").children[0]
          .children[0].src,
        name: document.querySelector(".user-details-container").children[0]
          .children[1].textContent,
        currentRating: parseInt(
          document.querySelector(".rating-number")?.textContent
        ),
        highestRating: parseInt(
          document
            .querySelector(".rating-number")
            ?.parentNode?.children[4]?.textContent?.split("Rating")[1]
        ),
        countryFlag: document.querySelector(".user-country-flag").src,
        countryName: document.querySelector(".user-country-name").textContent,
        globalRank: parseInt(
          document.querySelector(".rating-ranks")?.children[0]?.children[0]
            ?.children[0]?.children[0]?.innerHTML
        ),
        countryRank: parseInt(
          document.querySelector(".rating-ranks")?.children[0]?.children[1]
            ?.children[0]?.children[0]?.innerHTML
        ),
        stars: document.querySelector(".rating")?.textContent || "unrated",
        heatMap: headMapData,
        ratingData,
      };
    } else {
      return { success: false, status: resdata.status };
    }
  } catch (e) {
    console.log(e);
    return { success: false, status: 404 };
  }
}
async function fetchSolvedCount(handle) {
  try {
    const axiosResponse = await axios.request({
      method: "GET",
      url: `https://thingproxy.freeboard.io/fetch/https://www.codechef.com/users/${handle}`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    });
    const match = axiosResponse.data.match(/Total Problems Solved:\s*(\d+)/);
    return parseInt(match[1]);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw new Error(error);
  }
}
async function fetchSolvedProblems(handle, minPage) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  async function fetchSubmissions(username, page = 0) {
    try {
      const url = `https://www.codechef.com/recent/user?page=${page}&user_handle=${username}`;
      const res = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0", // Required to avoid 403
        },
      });
      const htmlContent = res.data.content;
      const maxPage = res.data.max_page ?? null; //  Important: capture max_page!
      if (!htmlContent) return { submissions: [], maxPage };
      const $ = cheerio.load(`<table>${htmlContent}</table>`);
      const submissions = [];
      $("tr").each((i, row) => {
        const tds = $(row).find("td");
        if (tds.length >= 4) {
          const resultSpan = $(tds[2]).find("span");
          const verdictTitle = resultSpan.attr("title") || "";
          const verdict = verdictTitle.toLowerCase().includes("accepted")
            ? "AC"
            : "WA";

          submissions.push({
            date: $(tds[0]).text().trim() || "",
            problem: $(tds[1]).text().trim() || "",
            result: verdict,
            language: $(tds[3]).text().trim() || "",
          });
        }
      });

      return { submissions, maxPage };
    } catch (err) {
      if (err.response?.status === 429) {
        console.warn(` Rate limit hit on page ${page}. Waiting 10s...`);
        await sleep(10000);
        return fetchSubmissions(username, page); // Retry
      }

      console.error(` Error fetching page ${page}:`, err.message);
      return { submissions: [], maxPage: null };
    }
  }
  const username = handle;
  const allSubmissions = [];
  let page = 0;
  let maxPage = null;
  let trueMaxPage = 0;
  let totalSubmissions = 0;
  while (true) {
    const { submissions, maxPage: pageMax } = await fetchSubmissions(
      username,
      page
    );
    if (page === 0 && pageMax !== null) {
      trueMaxPage = pageMax - 1;
      const { submissions } = await fetchSubmissions(username, trueMaxPage);
      totalSubmissions = trueMaxPage * 12 + submissions.length;
      maxPage = pageMax - 1 - minPage;
      console.log(` Max page detected: ${maxPage}`);
    }
    if (submissions.length === 0) {
      console.log(" No more submissions found. Stopping.");
      break;
    }
    allSubmissions.push(...submissions);
    page++;
    if (maxPage !== null && page > maxPage) {
      console.log(` Reached the last page (${maxPage}). Stopping.`);
      break;
    }
    await sleep(6000);
  }
  console.log(` Total submissions fetched: ${allSubmissions.length}`);
  return { allSubmissions, trueMaxPage, totalSubmissions };
}
module.exports = { fetchContestData, fetchSolvedCount, fetchSolvedProblems };
