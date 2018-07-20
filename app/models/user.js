//load the shit
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const userSchema = mongoose.Schema({
  email: { type: String, lowercase: true, trim: true },
  password: String,
  name: { type: String, trim: true },
  emailConfirmed: { type: Boolean, default: false },
  emailConfirmationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Number
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
//is password valid
userSchema.methods.isValidPassword =function (password) {
    return bcrypt.compareSync(password, this.password);
};
// email confirm
userSchema.methods.isEmailConfirmed = function () {
    return this.emailConfirmed;
};
// create model
module.exports = mongoose.model('User', userSchema);