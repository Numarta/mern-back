import bcrypt from 'bcrypt';

import User from '../models/User.js';

import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const password = await req.body.password;
    const passwordHashed = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      email: req.body.email,
      fullName: req.body.fullname,
      passwordHash: passwordHashed,
      avatar: req.body.avatar,
    });

    const { passwordHash, ...dataUser } = createdUser._doc;

    res.json({ success: true, dataUser });
  } catch (err) {
    res.status(500).json({ message: `Не удалось зарегистрироваться ${err}` });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({ message: 'Неверный email' });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash,
    );

    if (!isValidPass) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    const token = jwt.sign(
      {
        id: user._doc._id,
      },
      'secrettoken',
      {
        expiresIn: '7d',
      },
    );

    res.json({ success: true, token: token });
  } catch (err) {
    res.status(500).json({ message: `Не удалось войти в профиль ${err}` });
  }
};

export const infoUser = async (req, res) => {
  try {
    console.log(req.userId);
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Ne naiden user' });
    }

    res.json({ success: true, user: user });
  } catch (err) {
    res.status(500).json({ message: `Не удалось войти в профиль ${err}` });
  }
};
