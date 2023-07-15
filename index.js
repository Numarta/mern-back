import express from 'express';
import multer from 'multer';

import mongoose from 'mongoose';
import checkAuth from './middlevares/checkAuth.js';
import { register, login, me } from './controllers/UserController.js';
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from './validation/validate.js';
import { create, getAll, getOne, remove, update } from './controllers/PostController.js';

mongoose
  .connect('mongodb://localhost:27017/merndb')
  .then(() => console.log('Connect success'))
  .catch((err) => console.log(err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
});

app.use(express.json());

app.get('/auth/me', checkAuth, me);
app.post('/auth/register', registerValidation, register);
app.get('/auth/login', loginValidation, login);

app.get('/posts', getAll);
app.get('/posts/:id', getOne);
app.post('/posts', checkAuth, postCreateValidation, create);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id', checkAuth, update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  } else {
    console.log('Server OK');
  }
});
