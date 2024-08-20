const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const mongoose = require("mongoose")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

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