const User = require("../model/User/User.js");
const UserRepository = require('../service/Repositories/UserRepository.js');
const passwordHelper = require('../util/helpers/passwordHelper.js');
const AuthStrategies = require("../util/AuthStrategies.js");
const BlackListRepository = require("../service/Repositories/BlacklistRepository.js");

const { UserSerializer, TokenSerializer } = require('../Serializer');

module.exports = {
    createUser: async (req, res, next) => {
        const {name, email, password} = req.body;

        try {
            const passwordHash = await passwordHelper.hashPassword(password);
            const user = new User(name, email, passwordHash);
            const result = await UserRepository.save(user);

            res.status(201);
            const serializer = new UserSerializer(res.getHeader('Content-Type'));
            res.send(serializer.serialize(result));

        } catch (error) {
            next(error);
        }
    },
    login: (req, res, next) => {
        const token = AuthStrategies.createToken(req.user);
        const tokenObj = {
            access_token: token,
            token_type: "Bearer"
        }

        res.status(200);
        const serializer = new TokenSerializer(res.getHeader('Content-Type'));
        res.send(serializer.serialize(tokenObj));
    },
    logout: async(req, res, next) => {
        try {
            const token = req.token;
            await BlackListRepository.add(token);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};