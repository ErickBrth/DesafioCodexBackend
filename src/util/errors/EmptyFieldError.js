class EmptyFieldError extends Error {
    constructor(field) {
        super(`O campo ${field} eh obrigatorio`);
        this.name = "EmptyFieldError";
        this.id = 5;
    }
}

module.exports = EmptyFieldError;