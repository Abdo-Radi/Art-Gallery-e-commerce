const express = require('express');
const cors = require('cors');
const app = express();
const indexRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

// Database connection
require('./config/database');

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use('/v1', indexRoutes);

app.use(errorHandler);

module.exports = app;