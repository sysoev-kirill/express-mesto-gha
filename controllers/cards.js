const Card = require('../models/card');
const {
  ERROR_CODE,
  ERROR_NOTFOUND,
  ERROR_DEFAULT,
} = require('../error/constantsErrors');


const ForbiddenError = require('../error/forbiddenError');
const ValidationError = require('../error/validationError');
const NotFoundError = require('../error/notFoundError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } else if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => res.send(card));
      } else {
        throw new ForbiddenError('Вы не можете удалить карточку другого пользователя');
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


const putCardLike = (req, res, next) => {
  console.log(req);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError('Переданы некорректные данные при постановке лайка'));
      } else {
        next(err);
      }
    });
};

const deleteCardLike = (req, res, next) => {
  console.log(req.user);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOTFOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError('Переданы некорректные данные при удалении лайка'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  putCardLike,
  deleteCardLike,
};
