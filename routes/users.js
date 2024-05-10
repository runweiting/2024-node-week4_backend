const express = require('express');
const router = express.Router();
const UsersControllers = require('../controllers/users');
const { handleErrorAsync } = require('../statusHandle/handleResponses');
const isAuth = require('../tools/isAuth');

router.post('/sign_up', handleErrorAsync(UsersControllers.signUp));
router.post('/sign_in', handleErrorAsync(UsersControllers.signIn));
router.patch(
  '/updatePassword',
  isAuth,
  handleErrorAsync(UsersControllers.updatePassword),
);

module.exports = router;
