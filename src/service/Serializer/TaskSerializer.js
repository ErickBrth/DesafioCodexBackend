const Serializer = require("./Serializer.js");

class TaskSerializer extends Serializer {
    constructor(contentType, extraFields = []) {
        super();
        this.contentType = contentType;
        this.publicFields = ['_id', 'name', 'priority'].concat(extraFields);
    }
}

module.exports = TaskSerializer;