const passport = require('passport');
const {ErrorSerializer} = require("../../service/Serializer");

function validate(error, user) {
    let status = null;
    let message;
    let otherFields = {};

    if(error && error.name === 'UserNotFound') {
        status = 401;
        message = "Email ou senha invalidos";
    }
    else if(error && error.name === 'TokenExpiredError') {
        status = 401;
        message = error.message;
        otherFields = {
            expiradoEm: error.expiredAt
        };
    }
    else if(error) {
        status = 401;
        message = error.message;
    }
    else if(!user) {
        status = 401;
        message = "Acesso nao autorizado";
    }

    if(status === null) {
        return null;
    } else {
        return {
            status: status,
            error: {
                message: message,
                ...otherFields
            }
        }
    }
}

module.exports = {
    local: (req, res, next) => {
        passport.authenticate(
            'local',
            { session: false },
            (error, user, info) => {
                const serializer = new ErrorSerializer(res.getHeader('Content-Type'), ['message']);

                const validateResult = validate(error, user);
                if(validateResult !== null) {
                    res.status(validateResult.status);
                    return res.send(serializer.serialize(validateResult.error));
                }

                req.user = user;
                return next();
            }
        ) (req, res, next);
    },
    bearer: (req, res, next) => {
        passport.authenticate(
            'bearer',
            { session: false },
            (error, user, info) => {
                const serializer = new ErrorSerializer(res.getHeader('Content-Type'), ['message', 'expiradoEm']);

                const validateResult = validate(error, user);
                if(validateResult !== null) {
                    res.status(validateResult.status);
                    return res.send(serializer.serialize(validateResult.error));
                }

                req.token = info.token;
                req.user = user;
                return next();
            }
        ) (req, res, next);
    }
}