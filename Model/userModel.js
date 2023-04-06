const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide me your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail(this.email), 'Enter a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    require: [true, 'Password should have atleaset 8 character'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm you Password'],
  },
});
//model variables are usually are with a captial letters
const User = mongoose.model('User', userSchema);
module.exports = User;
