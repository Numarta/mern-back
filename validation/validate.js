import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
  body('fullname').isLength({ min: 3 }),
  body('avatar').optional().isURL(),
];

export const loginValidation = [body('email').isEmail(), body('password').isLength({ min: 5 })];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Текст статьи').isLength({ min: 10 }).isString(),
  body('tags', 'Неверный формат тегов').optional().isArray(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];
