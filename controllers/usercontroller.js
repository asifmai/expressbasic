const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;
const User = require('../models/user');
const mailer = require('../helpers/mailer');

module.exports.client_register_post = async (req, res, next) => {
  const {firstName, lastName, email, password} = req.body;
  
  // See if email is already registered
  let foundUser = await User.findOne({email});
  if (foundUser) {
    return res.render('register', {firstName, lastName, email, error_msg: 'Email is already registered'});
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

  res.render('register-success');
}

const sendVerificationCode = (user) => {
  const subject = 'Verify your Email';
  const body = `
  <h1>You are registered</h1>
  <h2>Click the link below to verify your email</h2>
  <a href="${process.env.DOMAIN}/verify-email/${user.verificationCode}"></a>
  `;
  mailer.sendMail(user.email, subject, body);
}

module.exports.verify_email_get = async () => {
  if (req.params.verificationCode) {
    await User.findOneAndUpdate({verificationCode: req.params.verificationCode}, {verified: true});
    const user = await User.findOne({verificationCode: req.params.verificationCode})
    res.render('register-continue', {user});
  } else {
    res.status(400).send('Invalid Code');
  };
}