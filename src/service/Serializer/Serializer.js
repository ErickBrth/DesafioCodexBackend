const ContentTypeNotSupported = require('../../util/errors/ContentTypeNotSupported.js');

class Serializer {
    json(data) {
        return JSON.stringify(data);
    }

    serialize(data) {
        data = this.filterData(data);
        if(this.contentType === 'application/json') {
            return this.json(data);
        }

        throw new ContentTypeNotSupported(this.contentType);
    }

    filterData(data) {
        if(Array.isArray(data)) {
            data = data.map(item => {
                return this.filterObject(item);
            });
        } else {
            data = this.filterObject(data);
        }
        return data;
    }

    filterObject(object) {
        const newObject = {};

        this.publicFields.forEach((field) => {
            if(object.hasOwnProperty(field)) {
                newObject[field] = object[field];
            }
        });

        return newObject;
    }
}

module.exports = Serializer;