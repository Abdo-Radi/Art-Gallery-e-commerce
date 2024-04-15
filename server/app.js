const express = require("express");
const app = express();


const port = process.env.PORT;
// Database connection
require("./config/database");

app.use(express.json());


app.listen(port, () => {
  console.log("Server is running on port " + port);
});

module.exports = app;
