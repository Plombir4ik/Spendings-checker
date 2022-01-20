const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const { check, validationResult } = require("express-validator");
const Categories = require("../models/Category");
const Transaction = require("../models/Transaction");
const res = require("express/lib/response");
const Category = require("../models/Category");
const router = Router();
const moment = require("moment");

router.get("/pie/:id", auth, async (req, res) => {
  try {
    const fromDate = req.params.id.split("_")[0];
    const transType = req.params.id.split("_")[1];
    const toDate = req.params.id.split("_")[2];

    const transactions = await Transaction.find({
      $and: [
        { owner: req.user.userId },
        { type: transType },
        { date: { $gte: fromDate } },
        { date: { $lte: toDate } },
      ],
    });

    const filteredCategories = [];

    for (var i = 0; i < transactions.length; i++) {
      if (
        filteredCategories.find(
          (categ) => categ.name == transactions[i].categoryName
        )
      ) {
        filteredCategories.find(
          (categ) => categ.name == transactions[i].categoryName
        ).sum =
          Number(
            filteredCategories.find(
              (categ) => categ.name == transactions[i].categoryName
            ).sum
          ) + Number(transactions[i].sum);
      } else {
        filteredCategories.push({
          name: transactions[i].categoryName,
          sum: Number(transactions[i].sum),
        });
      }
    }

    console.log(filteredCategories);

    res.json(filteredCategories);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/line/:id", auth, async (req, res) => {
  try {
    const fromDate = req.params.id.split("_")[0];
    const transType = req.params.id.split("_")[1];
    const toDate = req.params.id.split("_")[2];

    const transactions = await Transaction.find({
      $and: [
        { owner: req.user.userId },
        { type: transType },
        { date: { $gte: fromDate } },
        { date: { $lte: toDate } },
      ],
    }).sort({ date: 1 });

    const filtered = [];

    for (var i = 0; i < transactions.length; i++) {
      if (
        filtered.find(
          (item) => item.date == moment(transactions[i].date).format()
        )
      ) {
        filtered.find(
          (item) => item.date == moment(transactions[i].date).format()
        ).sum =
          Number(
            filtered.find(
              (item) => item.date == moment(transactions[i].date).format()
            ).sum
          ) + Number(transactions[i].sum);
      } else {
        filtered.push({
          date: moment(transactions[i].date).format(),
          sum: Number(transactions[i].sum),
        });
      }
    }

    console.log(filtered);
    res.json(filtered);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
