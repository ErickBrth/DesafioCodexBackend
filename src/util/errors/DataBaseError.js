class DataBaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "Data Base Error";
        this.id = 0;
    }
}

module.exports = DataBaseError;