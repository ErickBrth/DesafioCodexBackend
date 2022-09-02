class UserNotFound extends Error {
    constructor() {
        super("Usuario nao encontrado");
        this.name = "UserNotFound";
        this.id = 3;
    }
}

module.exports = UserNotFound;