const passwordHelper = require("../../util/helpers/passwordHelper.js");
const validator = require("../../util/helpers/validators.js");
const {WrongEmailOrPasswordError} = require("../../util/errors");

class User {
    constructor(name, email, passwordHash, id = null) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.id = id;
    }

    static validate(name, email, password) {
        validator.emptyField({
            name: name,
            email: email,
            password: password
        });
        validator.validateEmail(email);
    }

    static async authenticateUser(user, password) {
        if(!user) {
            throw new WrongEmailOrPasswordError();
        }
        await passwordHelper.verifyPassword(user.passwordHash, password);
    }
}

module.exports = User;
