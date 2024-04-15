const express = require('express');
const app = express();
const indexRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

// Database connection
require('./config/database');

app.use(express.json());
app.use('/v1', indexRoutes);

app.use(errorHandler);

module.exports = app;