const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateProfileUser,
  updateAvatar,
  getInfoAboutMe,
} = require('../controllers/users');

const regexUrl = /https?:\/\/(www\.)?[-\w@:%.+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%.+~#=/?&]*)/i;

router.get('/users', getUsers);
router.get('/users/me', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), getInfoAboutMe);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfileUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regexUrl).required(),
  }),
}), updateAvatar);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);


module.exports = router;
