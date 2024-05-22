const express = require('express');
const router = express.Router();
const { handleErrorResponse } = require('../middlewares/handleResponses');

router.use((req, res, next) => {
  handleErrorResponse(res, 404, '無此頁面資訊');
});

module.exports = router;
