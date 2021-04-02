const User = require("../model/User/User.js");
const UserRepository = require('../service/Repositories/UserRepository.js');
const passwordHelper = require('../util/helpers/passwordHelper.js');
const AuthStrategies = require("../util/AuthStrategies.js");
const BlackListRepository = require("../service/Repositories/BlacklistRepository.js");
const { UserSerializer, TokenSerializer } = require('../service/Serializer');

function sendResponse(res, status, result, serializer) {
    res.status(status);
    res.send(serializer.serialize(result));
}

function endResponse(res, status) {
    res.status(status);
    res.end();
}

module.exports = {
    createUser: async (req, res, next) => {
        const {name, email, password} = req.body;

        try {
            User.validate(name, email, password);

            const passwordHash = await passwordHelper.hashPassword(password);
            const user = new User(name, email, passwordHash);
            const result = await UserRepository.save(user);

            sendResponse(res, 201, result, new UserSerializer(res.getHeader('Content-Type')));
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

        sendResponse(res, 200, tokenObj, new TokenSerializer(res.getHeader('Content-Type')));
    },
    logout: async(req, res, next) => {
        try {
            const token = req.token;
            await BlackListRepository.add(token);
            endResponse(res, 204);
        } catch (error) {
            next(error);
        }
    }
};