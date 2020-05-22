const express = require("express");
const SignUpController = require("../controllers/auth/SignUpController");
const SignInController = require("../controllers/auth/SignInController");
const UserController = require("../controllers/UserController");
const IncomeController = require("../controllers/IncomeController");
const ExpenseController = require("../controllers/ExpenseController");
const SignOutController = require("../controllers/auth/SignOutController");
const checkAuth = require("../middlewares/auth");

const APIROUTER = express.Router();

// auth requests
APIROUTER.post("/sign-up", SignUpController.registerUser);
APIROUTER.post("/sign-in", SignInController.signIn);
APIROUTER.post("/sign-out", checkAuth, SignOutController.signOut);
APIROUTER.post("/sign-out-all", checkAuth, SignOutController.signOutAll);
APIROUTER.get("/users/current/:id", checkAuth, UserController.getCurrentUser);

APIROUTER.put(
  "/users/upload-display-picture",
  checkAuth,
  UserController.uploadDisplayPicture
);

// Income Request
APIROUTER.post("/income", checkAuth, IncomeController.newIncome);
APIROUTER.get("/income/date", checkAuth, IncomeController.getSingleValue);
APIROUTER.get(
  "/income/month/:startDate/:endDate/:creator",
  checkAuth,
  IncomeController.getMontlyValue
);
APIROUTER.put("/income/:id", checkAuth, IncomeController.updateIncome);

//Expense Request
APIROUTER.post("/expense", checkAuth, ExpenseController.newExpense);
APIROUTER.get("/expense/date", checkAuth, ExpenseController.getSingleValue);
APIROUTER.get("/expense/month", checkAuth, ExpenseController.getMontlyValue);
APIROUTER.put("/expense/:id", checkAuth, ExpenseController.updateExpense);

module.exports = APIROUTER;
