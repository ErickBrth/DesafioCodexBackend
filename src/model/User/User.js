const passwordHelper = require("../../util/helpers/passwordHelper.js");
const {InvalidArgumentError} = require("../../util/errors");

class User {
    constructor(name, email, passwordHash, id = null) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.id = id;
    }

    static async validateUser(user, password) {
        if(!user) {
            throw new InvalidArgumentError("Email ou senha invalido");
        }
        await passwordHelper.verifyPassword(user.passwordHash, password);
    }
}

module.exports = User;