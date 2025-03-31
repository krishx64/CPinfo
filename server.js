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
app.get("/resources", async (req, res) => {
  try {
    const resources = await userInfo.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//middleware
app.use(express.static(path.join(__dirname, "build")));
// app.use(express.static("./public"));
app.use(express.json());

//routes

// app.use("/api/v1/tasks", tasks);
// app.use(notFound);
// app.use(errorHandlerMiddleware);

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
