const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://flourishgarden1.surge.sh",
  "https://b11a10-server-side-ecru.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("Not allowed by CORS"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASS}@cluster0.as2f3ea.mongodb.net/gardenDB?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

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
const gardenerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  status: { type: String, required: true },
  experience: { type: String, required: true },
  image: { type: String, required: true },
  totalTips: { type: Number, default: 0 },
});

const Gardener = mongoose.model("Gardener", gardenerSchema);

app.get("/", (req, res) => {
  res.send("Garden server running");
});

app.post("/tips", async (req, res) => {
  const {
    title,
    description,
    plantType,
    difficulty,
    category,
    availability,
    userEmail,
    userName,
    imageUrl,
  } = req.body;

  const newTip = new Tip({
    title,
    description,
    plantType,
    difficulty,
    category,
    availability,
    userEmail,
    userName,
    imageUrl,
  });

  try {
    await newTip.save();
    res.status(201).json({ message: "Tip added successfully", id: newTip._id });
  } catch (err) {
    res.status(500).json({ message: "Failed to add tip", error: err });
  }
});

app.get("/tips", async (req, res) => {
  const { difficulty } = req.query;
  let query = { availability: "Public" };
  if (difficulty) query.difficulty = difficulty;

  try {
    const tips = await Tip.find(query);
    res.json(tips);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tips", error: err });
  }
});

app.get("/tips/:id", async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id);
    if (!tip) return res.status(404).send("Tip not found");
    res.json(tip);
  } catch (error) {
    res.status(500).send("Failed to fetch tip");
  }
});


app.get("/gardeners", async (req, res) => {
  const { status, limit } = req.query;
  let query = {};


  if (status) query.status = status;

  try {
    let gardenerQuery = Gardener.find(query);

    
    if (limit) {
      const parsedLimit = parseInt(limit);
      if (!isNaN(parsedLimit)) {
        gardenerQuery = gardenerQuery.limit(parsedLimit);
      }
    }

    const gardeners = await gardenerQuery;
    res.json(gardeners);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gardeners", error });
  }
});



app.put("/tips/:id", async (req, res) => {
  const id = req.params.id;
  const updatedTip = req.body;

  try {
    const result = await Tip.findByIdAndUpdate(id, updatedTip, { new: true });
    if (!result) return res.status(404).json({ message: "Tip not found" });
    res.json({ message: "Tip updated successfully", updatedTip: result });
  } catch (err) {
    res.status(500).json({ message: "Failed to update tip", error: err });
  }
});

app.delete("/tips/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Tip.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: "Tip not found" });
    res.json({ message: "Tip deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete tip", error: err });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
