const {Schema, model} = require('mongoose');

const UserModel = new Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            match: /^\w+([.-]?\w+)*(@codexjr.com.br)+$/
        },
        passwordHash: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    });

module.exports = model('User', UserModel);