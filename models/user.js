const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  profile: {
    firstName: String,
    lastName: String,
    company: String,
    certification: String,
    expertise: String,
    address: {
      street: String,
      state: String,
      country: String,
      zip: String,
    }
  },
  email: String,
  phone: String,
  role: String,
  password: String,
  verified: Boolean,
  verificationCode: String,
  forgotPasswordCode: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

userSchema.virtual('fullName').get(function() {
  return this.profile.firstName + ' ' + this.profile.lastName;
});

userSchema.set('toObject', {virtuals: true});
userSchema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('User', userSchema);