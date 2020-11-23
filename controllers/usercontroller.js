const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;
const User = require('../models/user');
const mailer = require('../helpers/mailer');

module.exports.client_register_post = async (req, res, next) => {
  const {firstName, lastName, email, password} = req.body;
  
  // See if email is already registered
  let foundUser = await User.findOne({email});
  if (foundUser) {
    return res.render('register/register', {firstName, lastName, email, error_msg: 'Email is already registered'});
  }

  // Add User
  const newUser = new User({
    profile: {
      firstName,
      lastName,
    },
    email,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    role: 'client',
    verified: false,
    verificationCode: uuid(),
  });

  await newUser.save();
  sendVerificationCode(newUser); 

  res.render('register/register-success', {user: newUser});
}

module.exports.consultant_register_post = async (req, res, next) => {
  const {firstName, lastName, email, password} = req.body;
  
  // See if email is already registered
  let foundUser = await User.findOne({email});
  if (foundUser) {
    return res.render('register/register-consultant', {firstName, lastName, email, error_msg: 'Email is already registered'});
  }

  // Add User
  const newUser = new User({
    profile: {
      firstName,
      lastName,
    },
    email,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    role: 'consultant',
    verified: false,
    verificationCode: uuid(),
  });

  await newUser.save();
  sendVerificationCode(newUser); 

  res.render('register/register-consultant-success', {user: newUser});
}

module.exports.client_register_complete_post = async (req, res, next) => {
  const {id, phone, company, street, state, zip, country} = req.body;
  
  const user = await User.findById(id);
  await User.findByIdAndUpdate(id, {
    phone,
    profile: {
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      company,
      address: {
        street,
        state,
        country,
        zip
      }
    } 
  })

  req.flash('success_msg', 'Registeration complete. You can now login');
  res.redirect('/login');
}

module.exports.consultant_register_complete_post = async (req, res, next) => {
  const {id, phone, company, street, state, zip, country, certification, expertise} = req.body;
  
  const user = await User.findById(id);
  await User.findByIdAndUpdate(id, {
    phone,
    profile: {
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      company,
      certification,
      expertise,
      address: {
        street,
        state,
        country,
        zip
      }
    } 
  })

  req.flash('success_msg', 'Registeration complete. You can now login');
  res.redirect('/login');
}

module.exports.verify_email_get = async (req, res) => {
  const {verificationCode} = req.params;
  await User.findOneAndUpdate({verificationCode}, {verified: true});
  const user = await User.findOne({verificationCode})

  if (user.role == 'client') {
    res.render('register/register-continue', {user});
  } else if (user.role == 'consultant') {
    res.render('register/register-consultant-continue', {user});
  }
}

module.exports.forgot_password_post = async (req, res, next) => {
  const {email} = req.body;

  // See if email is already registered
  let foundUser = await User.findOne({email});
  if (!foundUser) {
    return res.render('password/forgot-password', {error_msg: 'Email is not registered'});
  };

  await User.findOneAndUpdate({email}, {forgotPasswordCode: uuid()});
  const user = await User.findOne({email});
  sendForgotPasswordLink(user);

  res.render('password/forgot-password-success', {user});
}

module.exports.reset_password_get = async (req, res, next) => {
  const {forgotPasswordCode} = req.params;
  const user = await User.findOne({forgotPasswordCode});

  res.render('password/reset-password', {user});
}

module.exports.reset_password_post = async (req, res, next) => {
  const {id, password} = req.body;
  await User.findByIdAndUpdate(id, {password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))});

  req.flash('success_msg', 'Password reset successfull. You can now login')
  res.redirect('/login');
}

const sendVerificationCode = (user) => {
  const subject = 'Verify your Email';
  const body = `
  <h1>You are registered</h1>
  <h2>Click the link below to verify your email</h2>
  <a href="${process.env.DOMAIN}/verify-email/${user.verificationCode}"></a>`;
  mailer.sendMail(user.email, subject, body);
}

const sendForgotPasswordLink = (user) => {
  const subject = 'Password Reset';
  const body = `
  <h1>Password Reset</h1>
  <h2>Click the link below to reset your password</h2>
  <a href="${process.env.DOMAIN}/reset-password/${user.forgotPasswordCode}"></a>`;
  mailer.sendMail(user.email, subject, body);
}