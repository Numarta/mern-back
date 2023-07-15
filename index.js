import express from 'express';
import multer from 'multer';

import mongoose from 'mongoose';
import checkAuth from './middlevares/checkAuth.js';
import handleValidationErrors from './middlevares/handleValidationErrors.js';

import {
  createPost,
  getAllPosts,
  getOnePost,
  removePost,
  updatePost,
} from './controllers/PostController.js';

import {
  registerUser,
  loginUser,
  infoUser,
} from './controllers/UserController.js';

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from './validation/validate.js';

mongoose
  .connect('mongodb://localhost:27017/merndb')
  .then(() => console.log('Connect success'))
  .catch((err) => console.log(err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/auth/me', checkAuth, infoUser);

app.post(
  '/auth/register',
  registerValidation,
  handleValidationErrors,
  registerUser,
);
app.post('/auth/login', loginValidation, handleValidationErrors, loginUser);

app.post('/upload', checkAuth, upload.single('image'), (req, res) =>
  res.json({ success: true, url: `/uploads/${req.file.originalname}` }),
);

app.get('/posts', getAllPosts);
app.get('/posts/:id', getOnePost);
app.post(
  '/posts',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  createPost,
);
app.delete('/posts/:id', checkAuth, removePost);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  updatePost,
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  } else {
    console.log('Server OK');
  }
});
