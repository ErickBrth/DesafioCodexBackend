const bcrypt = require("bcrypt");
const validators = require("./validators.js");
const {WrongEmailOrPasswordError} = require("../errors");

function validatePassword(password) {
    validators.fieldMinimumLength(password, "password", 8);
}

module.exports = {
    hashPassword: (password) => {
        validatePassword(password);
        const cost = 12;
        return bcrypt.hash(password, cost);
    },
    verifyPassword: async (hash, password) => {
        const validPassword = await bcrypt.compare(password, hash);
        if(!validPassword) {
            throw new WrongEmailOrPasswordError();
        }
    }
}