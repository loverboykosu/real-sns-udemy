const express = require("express");
const app = express();
const PORT = 3000;
const userRoute = require("./routes/users.js");
const authRoute = require("./routes/auth");
//ミドルウェア
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.get("/", (req, res) => {
  res.send("hello express");
});

app.listen(PORT, () => console.log("Start server"));
