var mongoose = require("mongoose");
var User = require("./User");

const SCHEMA = mongoose.Schema;

const expenseSchema = new SCHEMA({
  kitchen: {
    type: Number,
    trim: true,
  },
  hotel: {
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

expenseSchema.statics.dateExist = async function (dates, creator) {
  let dateExist = await EXPENSE.findOne({ dates: dates, creator: creator });
  return dateExist;
};

expenseSchema.methods.toJSON = function () {
  let expense = this.toObject();
  delete expense.createdAt;
  delete expense.__v;
  return expense;
};

const EXPENSE = mongoose.model("expense", expenseSchema);
module.exports = EXPENSE;
