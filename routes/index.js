const express = require('express');
const router = express.Router();

/* GET home page. */
router.get(
  '/',
  function (req, res, next) {
    res.render('index', { title: 'Express' });
  },
  /**
   * #swagger.ignore = true
   */
);

module.exports = router;
