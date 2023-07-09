const Card = require('../models/card');
const {
  ERROR_CODE,
  ERROR_NOTFOUND,
  ERROR_DEFAULT
} = require('../error/constantsErrors');

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch((err) => {
      return res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" })
    })
}

const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card)
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE).send({ message: "Введены некорректные данные" })
      } else {
        return res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" })
      }
    })
}

const deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => res.send(card)
    )
    .catch((err) => {
      if (err.name === "NotFoundError") {
        return res.status(ERROR_NOTFOUND).send({ message: "Запрашиваемая карточка не найдена" })
      } else {
        return res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" })
      }
    })
}


const putCardLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE).send({ message: "Переданы некорректные данные при постановке лайка" })
      } else if (err.name === "NotFoundError") {
        return res.status(ERROR_NOTFOUND).send({ message: "Передан несуществующий _id карточки" })
      } else {
        return res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" })
      }
    })
}

const deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE).send({ message: "Переданы некорректные данные при удалении лайка" })
      } else if (err.name === "NotFoundError") {
        return res.status(ERROR_NOTFOUND).send({ message: "Передан несуществующий _id карточки" })
      } else {
        return res.status(ERROR_DEFAULT).send({ message: "Произошла ошибка" })
      }
    })
}

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  putCardLike,
  deleteCardLike
}
