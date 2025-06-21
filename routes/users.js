const User = require("../models/User");

const router = require("express").Router();

//CRUD操作
//C : Create
//R : Read
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updateAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});
//U : Update
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("ユーザ情報が更新されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("あなたは自分のアカウントの時だけ情報を更新できます");
  }
});
//D : Delete
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("ユーザ情報が削除されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("あなたは自分のアカウントの時だけ情報を削除できます");
  }
});

//ユーザのフォロー
router.put("/:id/follow", async (req, res) => {
  //follow対象が自分のアカウントでないかどうか
  //body.userId : 自分のアカウント、params.id : follow対象のアカウント
  if (req.body.userId !== req.params.id) {
    try {
      //user : follow対象の情報
      const user = await User.findById(req.params.id);
      //currentUser : 自分自身のアカウンｔｐの情報
      const currentUser = await User.findById(req.body.userId);
      //followerに自分がいるかどうか
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("follow成功");
      } else {
        return res.status(403).json("follow済");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身をフォローできません");
  }
});

module.exports = router;
