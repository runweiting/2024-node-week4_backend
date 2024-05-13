const express = require('express');
const router = express.Router();
const UsersControllers = require('../controllers/users');
const { handleErrorAsync } = require('../statusHandle/handleResponses');
const isAuth = require('../tools/isAuth');

router.post('/sign-up', handleErrorAsync(UsersControllers.signUp));
router.post('/sign-in', handleErrorAsync(UsersControllers.signIn));
router.patch(
  '/update-password',
  isAuth,
  handleErrorAsync(UsersControllers.updatePassword),
);
router.get('/profile', isAuth, handleErrorAsync(UsersControllers.getProfile));
router.patch(
  '/profile',
  isAuth,
  handleErrorAsync(UsersControllers.updateProfile),
);
router.post('sign-out', isAuth, UsersControllers.signOut);

module.exports = router;
