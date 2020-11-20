const nodemailer = require('nodemailer');

module.exports.sendMail = async (email, subject, body) => {
  nodemailer.createTestAccount((err, account) => {
    if (err) {
      console.log(err);
    } else {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_LOGIN,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
  
      const mailOptions = {
        from: `Apek Group <${process.env.GMAIL_LOGIN}>`,
        to: email,
        subject,
        html: body,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Email Sent to Client : %s', info.response);
      });
    }
  });
}
