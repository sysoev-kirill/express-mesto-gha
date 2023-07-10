const User = require('../models/user');
const {
  ERROR_CODE,
  ERROR_NOTFOUND,
  ERROR_DEFAULT,
} = require('../error/constantsErrors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE).send({ message: "Переданы некорректные данные" });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" }));
};


const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOTFOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' }));
};

const updateProfileUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.name === "NotFoundError") {
        return res.status(ERROR_NOTFOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else if (err.name === "NotFoundError") {
        return res.status(ERROR_NOTFOUND).send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfileUser,
  updateAvatar,
};
