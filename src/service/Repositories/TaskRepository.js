const TaskModel = require('../../model/Task/TaskModel.js');
const DataBaseError = require("../../util/errors/DataBaseError.js");

module.exports = {
    create: async (task) => {
        const instance = new TaskModel(task);
        const result = await instance.save();
        return result.toObject();
    },
    listAll: async () => {
        const result = await TaskModel.find();
        return result.map(model => model.toObject());
    },
    findTaskById: (id) => {
        return TaskModel.findById(id);
    },
    updateTask: async (id, task) => {
        await TaskModel.updateOne({_id: id}, task, {runValidators: true})
    },
    deleteTask: async (id) => {
        const result = await TaskModel.deleteOne({_id: id});
        if(result.n === 0) {
            throw new DataBaseError("Essa tarefa nao existe");
        }
    }
}