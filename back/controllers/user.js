const express = require('express');
const expressSanitizer = require('express-sanitizer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

const app = express();

// Middleware pour la désinfection de données
app.use(expressSanitizer());

/* Register an account */
exports.signup = (req, res, next) => {
    // Désinfecte l'email et le mot de passe de l'utilisateur
    const email = req.sanitize(req.body.email);
    const password = req.sanitize(req.body.password);

    bcrypt.hash(password, 10)
    .then(hash => {
        const user = new User({ email, password: hash });
        user.save()
        .then(() => res.status(200).json({message:'User created'}))
        .catch(error => res.status(400).json({message:'adress mail already used'}));
    })
    .catch(error => res.status(500).json({ error }));
};

/* Login */
exports.login = (req, res, next) => {
    // Désinfecte l'email et le mot de passe de l'utilisateur
    const email = req.sanitize(req.body.email);
    const password = req.sanitize(req.body.password);

    User.findOne({ email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        bcrypt.compare(password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ message: 'Error on email or password' });
            }

            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
module.exports = router ;