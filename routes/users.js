const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');

/* GET users listing. */
router.get('/', userController.users_get);

module.exports = router;
