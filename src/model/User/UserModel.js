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
