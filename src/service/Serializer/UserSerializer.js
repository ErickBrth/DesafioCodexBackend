const Serializer = require("./Serializer.js");

class UserSerializer extends Serializer {
    constructor(contentType, extraFields = []) {
        super();
        this.contentType = contentType;
        this.publicFields = ['_id', 'name', 'email'].concat(extraFields);
    }
}

module.exports = UserSerializer;
