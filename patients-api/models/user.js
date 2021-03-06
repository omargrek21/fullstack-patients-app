const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'username cannot be blank',
        trim: true,
        unique: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
        type: String,
        required: 'password cannot be blank'
    },
    role: {
        type: String,
        required: 'Role cannot be blank'
    },
    created_date: {
        type: Date,
        default: Date.now()
    },
    modified_date: {
        type: Date,
        default: Date.now()
    },
    name: {
      type: String,
      required:false
    },
    lastname: {
      type: String,
      required:false
    },
    dni: {
      type: String,
      required:false
    }
});

userSchema.pre("save", async function(next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    let hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword, next) {
  try {
    let isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    return next(err);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;