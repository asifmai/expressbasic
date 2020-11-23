const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexcontroller');
const userController = require('../controllers/usercontroller');
const auth = require('../helpers/auth');

// Landing Page Routes
router.get('/', indexController.index_get);

router.get('/login', indexController.login_get);
router.post('/login', indexController.login_post);

router.get('/register', indexController.client_register_get);
router.post('/register', userController.client_register_post);
router.get('/verify-email/:verificationCode', userController.verify_email_get);
router.post('/register-complete', userController.client_register_complete_post);

router.get('/register-consultant', indexController.consultant_register_get);
router.post('/register-consultant', userController.consultant_register_post);
router.post('/register-consultant-complete', userController.consultant_register_complete_post);

router.get('/forgot-password', indexController.forgot_password_get);
router.post('/forgot-password', userController.forgot_password_post);
router.get('/reset-password/:forgotPasswordCode', userController.reset_password_get);
router.post('/reset-password', userController.reset_password_post);

// Admin Routes
router.get('/dashboard', auth.ensureAuthenticated, indexController.dashboard_get);

module.exports = router;
