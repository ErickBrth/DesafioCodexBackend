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
        }
    },
    {
        timestamps: true,
    });

module.exports = model('Task', TaskModel);