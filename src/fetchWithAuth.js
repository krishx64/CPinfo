// async function fetchWithAuth(
//   url,
//   options = {},
//   accessToken,
//   setAccessToken,
//   setUsername
// ) {
//   // Add Authorization header with access token
//   const headers = {
//     ...options.headers,
//     Authorization: `Bearer ${accessToken}`,
//     "Content-Type": "application/json",
//   };

//   let res = await fetch(url, {
//     ...options,
//     headers,
//     credentials: "include", // important for cookies (refreshToken)
//   });

//   if (res.status === 401) {
//     // Token might be expired — try to refresh it
//     const tokenRes = await fetch("http://localhost:3000/api/token", {
//       method: "POST",
//       credentials: "include", // send refreshToken cookie
//     });

//     if (tokenRes.ok) {
//       const data = await tokenRes.json();
//       const newAccessToken = data.accessToken;
//       const newUsername = data.username;

//       setAccessToken(newAccessToken); // update in context or state
//       setUsername(newUsername);

//       // Retry original request with new token
//       res = await fetch(url, {
//         ...options,
//         headers: {
//           ...headers,
//           Authorization: `Bearer ${newAccessToken}`,
//         },
//         credentials: "include",
//       });
//     } else {
//       throw new Error("Session expired. Please log in again.");
//     }
//   }

//   return res;
// }

// module.exports = { fetchWithAuth };
