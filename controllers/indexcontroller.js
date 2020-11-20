const passport = require('passport');

module.exports.index_get = (req, res, next) => {
  res.render('index');
}

module.exports.login_get = (req, res, next) => {
  res.render('login');
}

module.exports.login_post = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: 'Email or Password Incorrect...',
  })(req, res, next);
}

module.exports.client_register_get = (req, res, next) => {
  res.render('register');
}

module.exports.consultant_register_get = (req, res, next) => {
  res.render('register-consultant');
}