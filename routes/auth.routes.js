const { Router } = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const res = require("express/lib/response");
const router = Router();

router.post(
  "/register",
  [
    check("email", "Некоректний email").isEmail(),
    check("password", "Мінімальна довжина пароля 6 символів").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некоректні дані при реєстрації",
        });
      }

      const { email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({ message: "Такий користувач уже існує" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email, password: hashedPassword });

      await user.save();
      res.status(201).json({ message: "Користувач створений" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Некоректний email").normalizeEmail().isEmail(),
    check("password", "Некоректний пароль").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некоректні дані при авторизації",
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Користувач з такою поштою не знайдений" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Користувач з такими паролем не знайдений" });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"));

      res.json({ token, userId: user.id });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

module.exports = router;
