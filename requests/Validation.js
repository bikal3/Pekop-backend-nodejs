// import Joi from "@hapi/joi";
const Joi = require("@hapi/joi");

const OPTIONS = {
  language: {
    key: "{{label}} ",
  },
};

// sign up validation
const SIGNUP = (signUpData) => {
  const signUpSchema = Joi.object().keys({
    firstName: Joi.string().min(2).max(20).required().label("First name"),
    familyName: Joi.string().min(2).max(20).required().label("Family name"),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .label("Email"),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .min(8)
      .max(15)
      .required()
      .label("Password"),
    totalIncome: Joi.number(),
    totalExpense: Joi.number(),
  });

  return Joi.validate(signUpData, signUpSchema, OPTIONS);
};

// sign in validaiton
const SIGNIN = (signInData) => {
  const signInSchema = Joi.object().keys({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .label("Email"),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .min(8)
      .max(15)
      .required()
      .label("Password"),
  });

  return Joi.validate(signInData, signInSchema, OPTIONS);
};
const INCOME = (incomeData) => {
  const incomeSchema = Joi.object().keys({
    room: Joi.number().min(1).required().label("Room"),
    restaurant: Joi.number().min(1).required().label("Restaurant"),
    out: Joi.number().min(1).required().label("Out"),
    total: Joi.number().min(1).required().label("Total"),
    dates: Joi.date().required().label("Date"),
    creator: Joi.string().required().label("Creator"),
  });

  return Joi.validate(incomeData, incomeSchema, OPTIONS);
};

const EXPENSE = (expenseData) => {
  const expenseSchema = Joi.object().keys({
    kitchen: Joi.number().min(1).required().label("Kitchen"),
    hotel: Joi.number().min(1).required().label("Hotel"),
    out: Joi.number().min(1).required().label("Out"),
    total: Joi.number().min(1).required().label("Total"),
    dates: Joi.date().required().label("Date"),
    creator: Joi.string().required().label("Creator"),
  });

  return Joi.validate(expenseData, expenseSchema, OPTIONS);
};

const UPDATEUSERDETIALS = (userDetails) => {
  const updateUserSchema = Joi.object().keys({
    firstName: Joi.string().min(2).max(20).required().label("First name"),
    familyName: Joi.string().min(2).max(20).required().label("Family name"),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .label("Email"),
    username: Joi.string()
      .alphanum()
      .min(5)
      .max(15)
      .required()
      .label("Username"),
  });

  return Joi.validate(userDetails, updateUserSchema, options);
};
module.exports = {
  SIGNUP,
  SIGNIN,
  INCOME,
  EXPENSE,
  UPDATEUSERDETIALS,
};
