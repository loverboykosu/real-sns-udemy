const router = require("express").Router();
const { RiErrorWarningFill } = require("react-icons/ri");
const User = require("../models/User");
//ユーザ登録
router.post("/register", async (req, res) => {
  try {
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//ログイン
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("ユーザが見つかりません");
    const vailedPassword = req.body.password === user.password;
    //パスワードが不正な場合
    if (!vailedPassword) return res.status(400).send("不正なパスワードです");
    //パスワードが正しい時
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
