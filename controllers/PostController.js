//postCreateValidation
import Post from '../models/Post.js';

export const createPost = async (req, res) => {
  try {
    const doc = new Post({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    return res.json({ message: `Не удалось создать пост, ${err}` });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).populate('user').exec();
    res.json(posts);
  } catch (err) {
    return res.json({ message: `Не удалось получить все посты, ${err}` });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const id = req.params.id;
    // const post = await Post.findOne({ _id: id }).populate('user').exec();
    const post = await Post.findOneAndUpdate(
      { _id: id },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' },
      // (err, doc) => {
      //   if (err) {
      //     res.json({ message: `Не удалось получить 1 пост, ${err}` });}
      //   if (!doc) {
      //     res.status(404).json({ message: `Статья не найдена, ${err}` });}},
    );

    if (!post) {
      res.status(404).json({ message: `Статья не найдена` });
    }
    res.json(post);
  } catch (err) {
    return res.json({ message: `Не удалось получить 1 пост, ${err}` });
  }
};

export const updatePost = async (req, res) => {
  try {
    const id = req.params.id;

    const post = await Post.findOneAndUpdate(
      { _id: id },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      },
      { returnDocument: 'after' },
    );

    if (!post) {
      res.status(404).json({ message: `Статья не найдена` });
    }
    res.json({ post, success: true });
  } catch (err) {
    return res.json({ message: `Не удалось изменить 1 пост, ${err}` });
  }
};

export const removePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findOneAndDelete(
      { _id: id },

      // (err, doc) => {
      //   if (err) res.status(500).json({ message: 'Не удалось удалить статью' });
      //   if (!doc) res.status(404).json({ message: 'Статья не найдена' });
      // }
    );

    if (!post) {
      res.status(404).json({ message: `Статья не найдена` });
    }
    res.json({ message: 'Success!' });
  } catch (err) {
    return res.json({ message: `Не удалось удалить пост, ${err}` });
  }
};
