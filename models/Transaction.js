const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  type: { type: String, required: true },
  sum: { type: String, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String },
  categoryId: { type: Types.ObjectId, ref: "Category" },
  categoryName: { type: String, required: true },
  owner: { type: Types.ObjectId, ref: "User" },
});

const name = "Transaction";

module.exports = model(name, schema);
