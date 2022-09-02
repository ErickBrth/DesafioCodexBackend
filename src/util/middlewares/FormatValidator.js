const { SupportedContentTypes } = require('../../service/Serializer');

module.exports = app => {
    app.use((req, res, next) => {
        let requestedFormat = req.header('Accept');

        if(requestedFormat === '*/*') {
            requestedFormat = 'application/json';
        }

        if(SupportedContentTypes.indexOf(requestedFormat) === -1) {
            res.status(406);
            res.end();
            return;
        }

        res.setHeader('Content-Type', requestedFormat);
        next();
    });
}