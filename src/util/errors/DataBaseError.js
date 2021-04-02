class DataBaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DataBaseError";
        this.id = 0;
    }
}

module.exports = DataBaseError;