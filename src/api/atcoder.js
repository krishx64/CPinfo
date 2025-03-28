async function fetchData(handle) {
  try {
    const response = await fetch(
      `https://proxy.cors.sh/https://atcoder.jp/users/${handle}/history/json`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
  }
}
module.exports = { fetchData };
