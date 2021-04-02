const Serializer = require("./Serializer.js");

class ErrorSerializer extends Serializer {
    constructor(contentType, extraFields = []) {
        super();
        this.contentType = contentType;
        this.publicFields = [].concat(extraFields);
    }
}

module.exports = ErrorSerializer;