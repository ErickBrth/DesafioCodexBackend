const TaskModel = require('../../model/Task/TaskModel.js');
const DataBaseError = require("../../util/errors/DataBaseError.js");

module.exports = {
    create: async (task) => {
        const instance = new TaskModel(task);
        const result = await instance.save();
        return result.toObject();
    },
    listAll: async (userId) => {
        const result = await TaskModel.find({userId: userId});
        return result.map(model => model.toObject());
    },
    findTaskById: async (id, userId) => {
        const taskDoc = await TaskModel.findOne({_id: id, userId: userId});
        if(!taskDoc) {
            throw new DataBaseError("Essa tarefa nao existe");
        }
        return taskDoc;
    },
    updateTask: async (id, task) => {
        await TaskModel.updateOne({_id: id}, task, {runValidators: true})
    },
    deleteTask: async (id, userId) => {
        const result = await TaskModel.deleteOne({_id: id, userId: userId});
        if(result.n === 0) {
            throw new DataBaseError("Essa tarefa nao existe");
        }
    }
}