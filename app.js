const express = require("express");

const app = express();
const mongoose = require("mongoose")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require("dotenv").config();

const userRoutes = require("./apis/routes/user")
const processRoutes = require("./apis/routes/prcoess")





app.use("/user", userRoutes)
app.use("/process", processRoutes)


mongoose.connect(process.env.connectionString);

mongoose.connection.on("connected", () => {
  console.log("mongodb connection established successfully");
});
mongoose.connection.on("error", () => {
  console.log("mongodb connection Failed");
});



module.exports = app