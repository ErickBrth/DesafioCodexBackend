const {EmptyFieldError} = require("../errors");
const {InvalidArgumentError} = require("../errors");
const validator = require('email-validator');
const {InvalidEmailError} = require("../errors");

module.exports = {
    fieldMinimumLength: (value, name, minimum) => {
        if(value.length < minimum) {
            throw new InvalidArgumentError(
                `O campo ${name} precisa ser maior que ${minimum} caracteres`
            );
        }
    },
    emptyField: (object) => {
        for(let prop in object) {
            if(!object[prop]) {
                throw new EmptyFieldError(prop);
            }
        }
    },
    validateEmail: (email) => {
        if(!validator.validate(email)) {
            throw new InvalidEmailError();
        }
    }
}
