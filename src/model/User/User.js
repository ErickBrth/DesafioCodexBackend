class User {
    constructor(name, email, passwordHash) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
    }
}

module.exports = User;