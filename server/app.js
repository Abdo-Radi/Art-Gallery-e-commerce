const express = require('express');
const app = express();

// Database connection
require('./config/database');

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to our Art Gallery!");
})

module.exports = app;