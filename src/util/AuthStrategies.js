const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('jsonwebtoken');
const UserRepository = require("../service/Repositories/UserRepository.js");
const User = require("../model/User/User.js");
const config = require('../config');
const BlackListRepository = require("../service/Repositories/BlacklistRepository.js");

module.exports = {
    createToken: (user) => {
        const payload = {
            id: user.id
        }

        return jwt.sign(payload, config.jwt.key, { expiresIn: parseInt(config.jwt.expiration) });
    }
}

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false
    }, async (email, password, next) => {
        try {
            const user = await UserRepository.findByEmail(email);
            await User.authenticateUser(user, password);
            next(null, user);
        } catch (error) {
            next(error);
        }
    })
);

passport.use(
    new BearerStrategy(
        async (token, next) => {
            try {
                await BlackListRepository.hasToken(token);
                const payload = jwt.verify(token, config.jwt.key);
                const user = await UserRepository.findById(payload.id);
                next(null, user, { token: token });
            } catch (error) {
                next(error);
            }
        }
    )
);