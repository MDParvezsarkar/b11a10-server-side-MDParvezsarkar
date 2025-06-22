const mongoose = require("mongoose");
require("dotenv").config();

const Gardener = require("./models/Gardener"); 
const uri = process.env.MONGO_URI;

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const gardeners = [
  {
    name: "John Doe",
    age: 30,
    gender: "Male",
    status: "Active",
    experiences: "5 years of gardening experience",
    image: "https://example.com/john.jpg",
    sharedTipsCount: 10,
  },
  {
    name: "Jane Smith",
    age: 28,
    gender: "Female",
    status: "Active",
    experiences: "3 years of gardening experience",
    image: "https://example.com/jane.jpg",
    sharedTipsCount: 5,
  },
 
];

const seedDB = async () => {
  await Gardener.deleteMany({}); 
  await Gardener.insertMany(gardeners); 
  console.log("Data seeded successfully!");
  mongoose.connection.close(); 
};

seedDB();
