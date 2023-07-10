const Card = require('../models/card');
const {
  ERROR_CODE,
  ERROR_NOTFOUND,
  ERROR_DEFAULT,
} = require('../error/constantsErrors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" }));
};

const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE).send({ message: "Введены некорректные данные" });
      } else {
        return res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" });
      }
    });
};

const deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOTFOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' }));
};


const putCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOTFOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при постановке лайка' }));
};

const deleteCardLike = (req, res) => {
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
    .catch((err) => res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при удалении лайка' }));
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  putCardLike,
  deleteCardLike,
};
