const bcrypt = require("bcrypt");

module.exports = {
    hashPassword: (password) => {
        const cost = 12;
        return bcrypt.hash(password, cost);
    },
    verifyPassword: (hash, password) => {
        return false;
    }
}