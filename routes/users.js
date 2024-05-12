const express = require('express');
const router = express.Router();
const UsersControllers = require('../controllers/users');
const { handleErrorAsync } = require('../statusHandle/handleResponses');
const isAuth = require('../tools/isAuth');

router.post('/sign_up', handleErrorAsync(UsersControllers.signUp));
router.post('/sign_in', handleErrorAsync(UsersControllers.signIn));
router.patch(
  '/update_password',
  isAuth,
  handleErrorAsync(UsersControllers.updatePassword),
);
router.get('/profile', isAuth, handleErrorAsync(UsersControllers.getProfile));
router.patch(
  '/profile',
  isAuth,
  handleErrorAsync(UsersControllers.updateProfile),
);

module.exports = router;
