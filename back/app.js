const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');
const app = express();
const cors = require('cors');
const expressSanitizer = require('express-sanitizer');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');


/* Mongo DB Connexion */
mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

/* Middleware CORS policy */
app.use(cors());

/* Convert all response and get in json data */
app.use(express.json());

/* Helmet */
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

/* Middleware image */
app.use('/images', express.static(path.join(__dirname, 'images')));

/* Middleware for data sanitization */
app.use(expressSanitizer());
/*

/* Route API */
app.use('/api/auth/', userRoutes);
app.use('/api', sauceRoutes);

module.exports = app;
