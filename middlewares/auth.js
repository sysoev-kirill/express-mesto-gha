// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const AuthError = require("../error/authError");


const isAuthorized = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
    return;
  }
  req.user = payload;
  next();
};

module.exports = isAuthorized;
