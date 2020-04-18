const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexcontroller');

/* GET - Public - home page */
router.get('/', indexController.index_get);

module.exports = router;
