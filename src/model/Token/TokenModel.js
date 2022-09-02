const {Schema, model} = require('mongoose');
const config = require('../../config');

const TokenModel = new Schema({
        token: {
            type: String,
            required: true
        },
        expire_at: {
            type: Date,
            required: true,
            index: {expires: config.jwt.expiration}
        }
    },
    {
        timestamps: true
    });

module.exports = model('TokenBlackList', TokenModel);