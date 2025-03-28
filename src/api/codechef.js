async function fetchData(handle) {
  try {
    const response = await fetch(
      `https://codechef-api.vercel.app/handle/${handle}`
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
