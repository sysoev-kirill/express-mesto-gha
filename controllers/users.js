// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const AuthError = require('../error/authError');
const ValidationError = require('../error/validationError');
const NotFoundError = require('../error/notFoundError');
const ConflictError = require('../error/conflictError');


const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};


const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};


const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateProfileUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(_id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      } else if (err.name === "NotFoundError") {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError('Переданы некорректные данные при обновлении аватара'));
      } else if (err.name === "NotFoundError") {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

const getInfoAboutMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      }
      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,

      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};


const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new AuthError('Неправильные почта или пароль'));
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new AuthError('Неправильные почта или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret', { expiresIn: '7d' });
          res.send({ token });
        })
        .catch((err) => {
          next(err);
        });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfileUser,
  updateAvatar,
  login,
  getInfoAboutMe,

};
