const mongoose = require('mongoose');
require('dotenv').config()

const uri = process.env.MONGODB_URI;

mongoose
    .connect(uri)
    .then(() => console.log('Connected to database'))
    .catch((error) => console.log(`ERROR: ${error.message}`));