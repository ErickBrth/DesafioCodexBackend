const TokenModel = require('../../model/Token/TokenModel.js');
const Token = require("../../model/Token/Token.js");
const {TokenExpiredError} = require("jsonwebtoken");

module.exports = {
    add: async token => {
        token = new Token(token);
        const instance = new TokenModel(token);
        const result = await instance.save();
        return result.toObject();
    },
    hasToken: async token => {
        token = new Token(token);
        const result = await TokenModel.findOne({token: token.token});

        if(result !== null) {
            throw new TokenExpiredError("Token expirado");
        }
    }
}