const Income = require("../models/Income");
const Validation = require("../requests/Validation");

class IncomeController {
  async newIncome(request, response) {
    const result = Validation.INCOME(request.body);

    if (result.error) {
      let error = result.error.details[0];
      response.status(422).json({
        success: false,
        error: { field: error.path[0], message: error.message },
      });
    } else if (
      await Income.dateExist(result.value.dates, result.value.creator)
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
        let newIncome = new Income(result.value);
        let saved = await newIncome.save();
        let income = await saved.populate("creator").execPopulate();
        response.status(201).json({
          success: true,
          message: `income recorded!`,
          income: income,
        });
      } catch (error) {
        response.status(500).json({ success: false, error: error.message });
      }
    }
  }

  async getSingleValue(request, response) {
    let { dates, creator } = request.body;
    let income = await Income.findOne({
      dates: dates,
      creator: creator,
    }).populate("creator");
    if (!income) {
      response
        .status(404)
        .json({ success: false, message: "income does not exist!" });
    } else {
      response.status(200).json({ success: true, income: income });
    }
  }

  async getMontlyValue(request, response) {
    let { startDate, endDate, creator } = request.body;
    let grandTotal = 0;

    let income = await Income.find({
      dates: {
        $gte: startDate,
        $lt: endDate,
      },
      creator: creator,
    });
    income.forEach((inc) => {
      grandTotal += inc.total;
    });
    if (!income) {
      response
        .status(404)
        .json({ success: false, message: "income does not exist!" });
    } else {
      response.status(200).json({
        success: true,
        income: income,
        grandTotal: grandTotal,
        dates: income.map(function (value) {
          return {
            date: value.dates,
            total: value.total,
          };
        }),
      });
    }
  }

  async updateIncome(request, response) {
    const result = Validation.INCOME(request.body);

    if (result.error) {
      let error = result.error.details[0];
      response.status(422).json({
        success: false,
        error: { field: error.path[0], message: error.message },
      });
    } else {
      try {
        let incomeId = request.params.id;
        let { room, restaurant, out, dates, total } = result.value;

        let income = await Income.findOneAndUpdate(
          { _id: incomeId },
          { room, restaurant, out, dates, total },
          { new: true }
        ).populate("creator");
        if (!income) {
          response
            .status(404)
            .json({ success: false, message: "Income does not exist!" });
        } else {
          response.status(201).json({
            success: true,
            message: "income updated!",
            income: income,
          });
        }
      } catch (error) {
        response.status(500).json({ success: false, error: error.message });
      }
    }
  }
}

module.exports = new IncomeController();
