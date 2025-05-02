const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
// const tasks = require("./routes/tasks");
const connectDB = require("./db/connect");
const redisClient = require("./db/redis");
// const notFound = require("./middleware/not-found");
// const errorHandlerMiddleware = require("./middleware/error-handler");
const RefreshTokens = require("./models/refreshTokens.js");
const path = require("path");
require("dotenv").config();
const { addToDB } = require("./controllers/addUserInfo");
const User = require("./models/user.js");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const DEFAULT_EXPIRATION = 3600;
//comment this for prod
app.use(
  cors({
    origin: "http://localhost:3001", // Your frontend URL
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());

let errorLog = { errorArray: [] };

app.get("/api/resources/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const cache = await redisClient.get(username);
    if (cache) return res.status(200).json(JSON.parse(cache));
    const response = await User.findOne({ username: username }).select(
      "-password"
    );
    if (!response)
      return res.status(404).json({ message: "User does not exist" });
    await redisClient.setEx(username, 600, JSON.stringify(response));
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// app.get("/api/resources/errors", async (req, res) => {
//   try {
//     res.json(errorLog.errorArray);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
app.post("/api/fetch", authenticateToken, async (req, res) => {
  try {
    const username = req.user.username;
    const handleName = req.body;

    const state = await redisClient.get(`${username}_fetch`);
    if (state) {
      return res.status(425).json({ message: "Fetching in progress" });
    }
    await redisClient.setEx(`${username}_fetch`, DEFAULT_EXPIRATION, "true");
    errorLog.errorArray = [];
    addToDB(handleName, username, errorLog);
    res.status(200).json({ message: "Data received successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/api/signin", async (req, res) => {
  try {
    const { email, username } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { confirmPassword, ...userData } = req.body; // Remove confirmPassword
    const newUser = new User({ ...userData, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email: email });
    if (!validUser) return res.status(401).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, validUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const username = validUser.username;
    const accessToken = generateAccessToken(username);
    const refreshToken = jwt.sign(
      { username },
      process.env.REFRESH_TOKEN_SECRET
    );
    await RefreshTokens.findOneAndUpdate(
      { username },
      { refreshToken: refreshToken, createdAt: new Date() },
      { upsert: true }
    );

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, // set to true in production
        sameSite: "Strict", //set to Strict in prod, Lax for dev
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({ accessToken, username });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  if (!(await RefreshTokens.findOne({ refreshToken: refreshToken })))
    return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(user.username);
    res.json({ accessToken: accessToken, username: user.username });
  });
});

app.delete("/api/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  await RefreshTokens.findOneAndDelete({ refreshToken });
  res.clearCookie("refreshToken");
  res.sendStatus(204);
});
function generateAccessToken(username) {
  return jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
//routes

// app.use(notFound);
// app.use(errorHandlerMiddleware);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening to port: ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
