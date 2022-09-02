class InvalidArgumentError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidArgumentError";
        this.id = 2;
    }
}

module.exports = InvalidArgumentError;