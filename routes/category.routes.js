const { Router } = require("express");
const auth = require("../middleware/auth.middleware");
const { check, validationResult } = require("express-validator");
const Category = require("../models/Category");
const res = require("express/lib/response");
const router = Router();

router.post("/create", auth, async (req, res) => {
  try {
    // const errors = validationResult(req)

    // if(!errors.isEmpty()){
    //     return res.status(400).json({
    //         errors : errors.array(),
    //         message: "Некоректні дані"
    //     })
    // }

    const { name, description } = req.body;

    const candidate = await Category.findOne({ name });

    if (candidate) {
      return res.status(400).json({ message: "Така категорія уже існує" });
    }

    const category = new Category({
      name,
      description,
      owner: req.user.userId,
    });

    await category.save();
    res.status(201).json({ message: "Категорія створена" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const categories = await Category.find({ owner: req.user.userId });

    res.json(categories);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/", auth, async (req, res) => {
  try {
    const id = req.body.categoryId;
    console.log("Видаляю id: " + id);

    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "Категорія видалена" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    res.json(category);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    await Category.findByIdAndUpdate(req.params.id, {
      name: name,
      description: description,
    });

    res.status(201).json({ message: "Категорія відредагована" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
