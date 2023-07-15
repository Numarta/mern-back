import jwt from 'jsonwebtoken';

export default async function checkAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace(/Bearer /, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secrettoken');
      req.userId = decoded.id;
      next();
    } catch (err) {
      res.status(403).json({ message: 'Нет доступа', err: err });
    }
  } else {
    res.status(403).json({ message: 'unauthorized' });
  }
}
