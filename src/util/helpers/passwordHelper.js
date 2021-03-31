const bcrypt = require("bcrypt");
const {InvalidArgumentError} = require("../errors");

module.exports = {
    hashPassword: (password) => {
        const cost = 12;
        return bcrypt.hash(password, cost);
    },
    verifyPassword: async (hash, password) => {
        const validPassword = await bcrypt.compare(password, hash);
        if(!validPassword) {
            throw new InvalidArgumentError("Senha ou email invalidos");
        }
    }
}