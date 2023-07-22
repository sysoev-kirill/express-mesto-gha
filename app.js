const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi, errors } = require('celebrate');

const regexUrl = /^(http:\/\/|https:\/\/w*\w)/;

const usersRoutes = require('./routes/users');
const сardsRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const isAuthorized = require('./middlewares/auth');
const NotFoundError = require('./error/notFoundError');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  family: 4,
});


app.use(express.json());
app.use(bodyParser.json());


app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(isAuthorized);
app.use(usersRoutes);
app.use(сardsRoutes);

app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(3000, () => {
  console.log('Сервер запущен');
});
