const {Schema, model} = require('mongoose');

const TaskModel = new Schema({
        name: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            enum: ['alta', 'baixa'],
            required: true
        },
        userId: {
            type: String,
            require: true
        },
        code: {
            type: Number,
            required: false,
        },
        token_list: {
            type: [String]
        },
        id_fcm: {
            type: String,
            required: false,
            default: null
        }
    },
    {
        timestamps: true,
    });

module.exports = model('Task', TaskModel);