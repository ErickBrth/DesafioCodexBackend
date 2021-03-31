class ContentTypeNotSupported extends Error {
    constructor(contentType) {
        super(`Formato ${contentType} nao suportado`);
        this.name = "Content Type Error";
        this.id = 1;
    }
}

module.exports = ContentTypeNotSupported;