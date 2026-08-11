const express = require("express");
const cors = require("cors");
const compression = require("compression");
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

// gzip every JSON response — list payloads compress to a fraction of their size
app.use(compression());

app.use(express.json());

// Artwork/exhibition images never change once written, so let the browser keep them
app.use(
  "/images",
  express.static(path.join(__dirname, "images"), { maxAge: "7d" })
);
app.use("/v1", indexRoutes);

app.use(errorHandler);

module.exports = app;
