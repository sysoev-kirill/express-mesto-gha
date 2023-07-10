const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateProfileUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.patch('/users/me', updateProfileUser);
router.patch('/users/me/avatar', updateAvatar);


module.exports = router;
