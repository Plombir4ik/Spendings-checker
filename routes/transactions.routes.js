const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const { check, validationResult } = require("express-validator");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const res = require("express/lib/response");
const router = Router();

router.post("/create", auth, async (req, res) => {
  try {
    const { categoryId, categoryName, type, sum, description, dateInfo } =
      req.body;

    const transaction = new Transaction({
      categoryId,
      categoryName,
      type,
      sum,
      description,
      date: dateInfo,
      owner: req.user.userId,
    });

    await transaction.save();
    res.status(201).json({ message: "Категорія створена" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ owner: req.user.userId });
    const categories = await Category.find({ owner: req.user.userId });

    res.json({ categories, transactions });
  } catch (e) {}
});

router.delete("/", auth, async (req, res) => {
  try {
    const id = req.body.transactionId;

    await Transaction.findByIdAndDelete(id);

    res.status(200).json({ message: "Категорія видалена" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    res.json(transaction);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { categoryId, categoryName, type, sum, description, dateInfo } =
      req.body;
    await Transaction.findByIdAndUpdate(req.params.id, {
      categoryId: categoryId,
      categoryName: categoryName,
      type: type,
      sum: sum,
      description: description,
      date: dateInfo,
    });

    res.status(200).json({ message: "Категорія відредагована" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
