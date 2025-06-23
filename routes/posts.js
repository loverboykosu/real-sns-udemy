const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
//投稿を作成
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//投稿を更新
router.put("/:id", async (req, res) => {
  //body.userId : post id
  //params id : 目的のpost id
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body,
      });
      return res.status(200).json("投稿編集に成功");
    } else {
      return res.status(403).json("あなたは他の人の投稿を編集できません");
    }
  } catch (err) {
    return res.status(403).json(err);
  }
});

//投稿を削除
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json("投稿を削除できました");
    } else {
      return res.status(500).json("投稿を削除できません");
    }
    //postId, userIdを確認
  } catch (err) {
    return res.status(500).json(err);
  }
});
//投稿を取得
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
    //postId, userIdを確認
  } catch (err) {
    return res.status(500).json(err);
  }
});

//特定の投稿にいいねをおす
router.put("/:id/like", async (req, res) => {
  //follow対象が自分のアカウントでないかどうか
  //body.userId : 自分のアカウント、params.id : follow対象のアカウント
  try {
    //user : follow対象の情報
    const post = await Post.findById(req.params.id);
    //投稿にいいねをしていない場合
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json("like成功");
    } else {
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      return res.status(403).json("unlike成功");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

//タイムラインの投稿を取得
//timeline/all : timelineだけだと、/:idと区別がつかないため
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    //followingsの投稿内容を全て取得する
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
