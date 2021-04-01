const {InvalidArgumentError} = require("../errors");

module.exports = {
    fieldMinimumLength: (value, name, minimum) => {
        if(value.length < minimum) {
            throw new InvalidArgumentError(
                `O campo ${name} precisa ser maior que ${minimum} caracteres`
            );
        }
    }
}