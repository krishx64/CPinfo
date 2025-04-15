const express = require("express");
const app = express();
// const tasks = require("./routes/tasks");
const connectDB = require("./db/connect");
const userInfo = require("./models/userInfo.js");
// const notFound = require("./middleware/not-found");
// const errorHandlerMiddleware = require("./middleware/error-handler");
const path = require("path");
require("dotenv").config();
const { addToDB } = require("./controllers/addUserInfo");
// addToDB();
//middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.static(path.join(__dirname, "build")));
// app.use(express.static("./public"));
app.use(express.json());

let errorLog = { errorArray: [] };
let cache = { resourcesCache: undefined };

app.get("/resources", async (req, res) => {
  try {
    if (cache.resourcesCache === undefined)
      cache.resourcesCache = await userInfo.find();
    res.json(cache.resourcesCache);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/resources/errors", async (req, res) => {
  try {
    res.json(errorLog.errorArray);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/fetch", async (req, res) => {
  try {
    errorLog.errorArray = [];
    addToDB(req.body, errorLog, cache);
    res.status(200).json({ message: "Data received successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//routes

// app.use("/api/v1/tasks", tasks);
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
