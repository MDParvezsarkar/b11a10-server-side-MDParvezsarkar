const mongoose = require("mongoose");

const tipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  plantType: { type: String },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
  category: { type: String, required: true },
  availability: { type: String, enum: ["Public", "Hidden"], default: "Public" },
  createdAt: { type: Date, default: Date.now },
  userEmail: { type: String },
  userName: { type: String },
  imageUrl: { type: String },
});

const Tip = mongoose.model("Tip", tipSchema);

module.exports = Tip;
