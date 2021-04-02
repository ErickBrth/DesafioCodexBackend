class ContentTypeNotSupported extends Error {
    constructor(contentType) {
        super(`Formato ${contentType} nao suportado`);
        this.name = "ContentTypeError";
        this.id = 1;
    }
}

module.exports = ContentTypeNotSupported;