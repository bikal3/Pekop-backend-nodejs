const Expense = require("../models/Expense");
const Validation = require("../requests/Validation");
const User = require("../models/User");

class ExpenseController {
  async newExpense(request, response) {
    const result = Validation.EXPENSE(request.body);

    if (result.error) {
      let error = result.error.details[0];
      response.status(422).json({
        success: false,
        error: { field: error.path[0], message: error.message },
      });
    } else if (
      await Expense.dateExist(result.value.dates, result.value.creator)
    ) {
      response.status(409).json({
        success: false,
        error: {
          field: "dates",
          message: "Date already registered!",
        },
      });
    } else {
      try {
        let newExpense = new Expense(result.value);
        let saved = await newExpense.save();
        let expense = await saved.populate("creator").execPopulate();
        response.status(201).json({
          success: true,
          message: `expense recorded!`,
          expense: expense,
        });
      } catch (error) {
        response.status(500).json({ success: false, error: error.message });
      }
    }
  }

  async getSingleValue(request, response) {
    let { dates, creator } = request.body;
    let expense = await Expense.findOne({
      dates: dates,
      creator: creator,
    }).populate("creator");
    if (!expense) {
      response
        .status(404)
        .json({ success: false, message: "expense does not exist!" });
    } else {
      response.status(200).json({ success: true, expense: expense });
    }
  }

  async getMontlyValue(request, response) {
    let { startDate, endDate, creator } = request.body;
    let grandTotal = 0;

    let expense = await Expense.find({
      dates: {
        $gte: startDate,
        $lt: endDate,
      },
      creator: creator,
    });
    expense.forEach((inc) => {
      grandTotal += inc.total;
    });
    if (!expense) {
      response
        .status(404)
        .json({ success: false, message: "expense does not exist!" });
    } else {
      response.status(200).json({
        success: true,
        expense: expense,
        grandTotal: grandTotal,
        dates: expense.map(function (value) {
          return {
            date: value.dates,
            total: value.total,
          };
        }),
      });
    }
  }

  async updateExpense(request, response) {
    const result = Validation.EXPENSE(request.body);

    if (result.error) {
      let error = result.error.details[0];
      response.status(422).json({
        success: false,
        error: { field: error.path[0], message: error.message },
      });
    } else {
      try {
        let expenseId = request.params.id;
        let { hotel, kitchen, out, dates, total } = result.value;

        let expense = await Expense.findOneAndUpdate(
          { _id: expenseId },
          { hotel, kitchen, out, dates, total },
          { new: true }
        ).populate("creator");
        if (!expense) {
          response
            .status(404)
            .json({ success: false, message: "Expense does not exist!" });
        } else {
          response.status(201).json({
            success: true,
            message: "expense updated!",
            expense: expense,
          });
        }
      } catch (error) {
        response.status(500).json({ success: false, error: error.message });
      }
    }
  }
}

module.exports = new ExpenseController();
