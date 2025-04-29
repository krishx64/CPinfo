const axios = require("axios");
const cheerio = require("cheerio");
async function fetchContestData(handle) {
  try {
    const response = await fetch(
      `https://codechef-api.vercel.app/handle/${handle}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error(error);
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
    return null;
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
        const cols = $(row)
          .find("td")
          .map((j, col) => $(col).text().trim())
          .get();

        // If at least 3 columns and valid problem name, accept
        if (cols.length >= 4 && cols[1] !== "") {
          submissions.push({
            date: cols[0] || "",
            problem: cols[1] || "",
            result: cols[2] || "",
            language: cols[3] || "",
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
  while (true) {
    const { submissions, maxPage: pageMax } = await fetchSubmissions(
      username,
      page
    );
    if (page === 0 && pageMax !== null) {
      trueMaxPage = pageMax - 1;
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
  return { allSubmissions, trueMaxPage };
}
module.exports = { fetchContestData, fetchSolvedCount, fetchSolvedProblems };
