class DuplicatedEmailError extends Error {
    constructor() {
        super("Já existe um usuário com esse email");
        this.name = "DuplicatedEmailError";
        this.id = 8;
    }
}

module.exports = DuplicatedEmailError;
