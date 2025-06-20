const express = require("express");
const app = express();
const PORT = 3000;
const userRoute = require("./routes/users.js");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const mongoose = require("mongoose");
require("dotenv").config();
//db接続
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("dbと接続中");
  })
  .catch((err) => {
    console.log(err);
  });
//ミドルウェア
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.get("/", (req, res) => {
  res.send("hello express");
});

app.listen(PORT, () => console.log("Start server"));
