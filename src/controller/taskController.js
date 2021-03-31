const Task = require('../model/Task/Task.js');

const repository = require('../service/Repositories/TaskRepository.js');
const DataBaseError = require("../util/errors/DataBaseError.js");
const sorting = require("../util/helpers/sorting.js");

const { TaskSerializer } = require('../Serializer');


module.exports = {
    createTask: async (req, res, next) => {
        const {name, priority} = req.body;

        try {
            const task = new Task(name, priority, req.user.id);
            const result = await repository.create(task);

            res.status(201);
            const serializer = new TaskSerializer(res.getHeader('Content-Type'));
            res.send(serializer.serialize(result));
        } catch (error) {
            next(error);
        }
    },
    listTasks: async (req, res, next) => {
        try {
            const tasks = await repository.listAll(req.user.id);
            tasks.sort(sorting.sortTaskByPriority);

            res.status(200);
            const serializer = new TaskSerializer(res.getHeader('Content-Type'));
            res.send(serializer.serialize(tasks));
        } catch (error) {
            next(error);
        }
    },
    updateTask: async (req, res, next) => {
        let {name, priority} = req.body;
        const id = req.params.id;

        try {
            const taskDoc = await repository.findTaskById(id,req.user.id);

            if(taskDoc === null) {
                throw new DataBaseError("Essa tarefa nao existe");
            }

            if(!name) name = taskDoc.name;
            if(!priority) priority = taskDoc.priority;

            const task = new Task(name, priority, req.user.id);
            await repository.updateTask(id, task);
            res.status(204);
            res.end();
        } catch (error) {
            next(error);
        }
    },
    deleteTask: async (req, res, next) => {
        const id = req.params.id;

        try {
            await repository.deleteTask(id, req.user.id);
            res.status(204);
            res.end();
        } catch (error) {
            next(error);
        }
    }
}