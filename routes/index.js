const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexcontroller');
const userController = require('../controllers/usercontroller');

/* GET - Public - home page */
router.get('/', indexController.index_get);
router.get('/login', indexController.login_get);
router.post('/login', indexController.login_post);
router.get('/register', indexController.client_register_get);
router.post('/register', userController.client_register_post);
router.get('/verify-email/:verificationCode', userController.verify_email_get);
router.get('/register-consultant', indexController.consultant_register_get);

module.exports = router;
