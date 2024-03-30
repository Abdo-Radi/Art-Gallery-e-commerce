const express = require('express');
const app = express();
const artistRouter = require("./routes/artistRoutes")
const adminRouter = require("./routes/adminRoutes")
require("dotenv").config();

const port = process.env.PORT
// Database connection
require('./config/database');

app.use(express.json());
app.use("/artists", artistRouter)
app.use("/admins",adminRouter)
app.listen(port, () => {
  console.log("Server is running on port "+port);
});

module.exports = app;