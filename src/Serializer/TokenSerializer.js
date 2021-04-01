const Serializer = require("./Serializer.js");

class TokenSerializer extends Serializer {
    constructor(contentType, extraFields = []) {
        super();
        this.contentType = contentType;
        this.publicFields = ['access_token', 'token_type'].concat(extraFields);
    }
}

module.exports = TokenSerializer;