const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCardById,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCardById);
router.put('/cards/:cardId/likes', putCardLike);
router.delete('/cards/:cardId/likes', deleteCardLike);

module.exports = router;
