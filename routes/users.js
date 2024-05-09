const express = require('express');
const router = express.Router();
const UsersControllers = require('../controllers/users');
const handleErrorAsync = require('../statusHandle/handleErrorAsync');

router.post('/sign_up', handleErrorAsync(UsersControllers.signUp));

module.exports = router;
