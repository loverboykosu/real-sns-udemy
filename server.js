const express = require("express");
const app = express();
const PORT = 3000;
const userRoute = require("./routes/users.js");

//ミドルウェア
app.use("/api/users", userRoute);
app.get("/", (req, res) => {
  res.send("hello express");
});

app.listen(PORT, () => console.log("Start server"));
