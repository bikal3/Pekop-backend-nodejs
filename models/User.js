var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var keys = require("../config/keys");

const SCHEMA = mongoose.Schema;

const USERSCHEMA = new SCHEMA({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  familyName: {
    type: String,
    required: [true, "Family name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email-address is required"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
  },
  displayPicture: {
    type: String,
    default: "dp_placeholder.png",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  authTokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// mongoose "pre" hook to hash the password of every new user
USERSCHEMA.pre("save", async function (next) {
  if (!this.isNew || !this.isModified) {
    next();
  } else {
    try {
      // hash the plain text password
      let hashedPassword = await bcrypt.hash(this.password, 10); // 10 is the salt rounds
      // set the hashed password to be the password of the new user
      this.password = hashedPassword;
      // execute next code
      next();
    } catch (error) {
      next(error);
      console.log(error.message);
    }
  }
});

//check if email exists already
USERSCHEMA.statics.emailExists = async function (email) {
  let emailExists = await USER.findOne({ email: email });
  return emailExists;
};

// compare login password with the actual password
USERSCHEMA.methods.comparePassword = async function (plainPassword) {
  let matched = await bcrypt.compare(plainPassword, this.password);
  return matched;
};

USERSCHEMA.methods.generateAuthToken = async function () {
  const token = await jwt.sign({ id: this._id }, keys.secret);
  this.authTokens = await this.authTokens.concat({ token });
  await this.save();
  return token;
};

// hide some attributes of user model while sending json response
USERSCHEMA.methods.toJSON = function () {
  let user = this.toObject();
  delete user.password;
  delete user.createdAt;
  delete user.__v;
  return user;
};

const USER = mongoose.model("user", USERSCHEMA);
// export default USER;
module.exports = USER;
