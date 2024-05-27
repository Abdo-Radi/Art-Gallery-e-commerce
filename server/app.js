const express = require("express");
const cors = require("cors");
const app = express();
let path = require("path");

const indexRoutes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

// Database connection
require("./config/database");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/v1", indexRoutes);

app.use(errorHandler);

module.exports = app;
