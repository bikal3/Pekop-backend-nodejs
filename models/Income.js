var mongoose = require("mongoose");
var User = require("./User");

const SCHEMA = mongoose.Schema;

const incomeSchema = new SCHEMA({
  room: {
    type: Number,
    trim: true,
  },
  restaurant: {
    type: Number,
    default: 0,
  },
  out: {
    type: Number,
    trim: true,
  },
  total: {
    type: Number,
    trim: true,
  },
  dates: {
    type: Date,
    default: Date.now,
  },
  creator: {
    type: SCHEMA.Types.ObjectId,
    ref: User,
  },
});

incomeSchema.statics.dateExist = async function (dates, creator) {
  let dateExist = await INCOME.findOne({ dates: dates, creator: creator });
  return dateExist;
};

incomeSchema.methods.toJSON = function () {
  let income = this.toObject();
  delete income.createdAt;
  delete income.__v;
  return income;
};

const INCOME = mongoose.model("income", incomeSchema);
module.exports = INCOME;
