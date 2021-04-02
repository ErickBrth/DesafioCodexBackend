const Task = require('../model/Task/Task.js');
const repository = require('../service/Repositories/TaskRepository.js');
const sorting = require("../util/helpers/sorting.js");
const { TaskSerializer } = require('../service/Serializer');

function sendResponse(res, status, result) {
    res.status(status);
    const serializer = new TaskSerializer(res.getHeader('Content-Type'));
    res.send(serializer.serialize(result));
}

function endResponse(res, status) {
    res.status(status);
    res.end();
}

module.exports = {
    createTask: async (req, res, next) => {
        const {name, priority} = req.body;

        try {
            Task.validate(name, priority);

            const task = new Task(name, priority, req.user.id);
            const result = await repository.create(task);

            sendResponse(res, 201, result);
        } catch (error) {
            next(error);
        }
    },
    listTasks: async (req, res, next) => {
        try {
            const tasks = await repository.listAll(req.user.id);
            tasks.sort(sorting.sortTaskByPriority);
            sendResponse(res, 200, tasks);
        } catch (error) {
            next(error);
        }
    },
    updateTask: async (req, res, next) => {
        let {name, priority} = req.body;
        const id = req.params.id;

        try {
            Task.validateUpdate(name, priority);

            const taskDoc = await repository.findTaskById(id,req.user.id);

            if(!name) name = taskDoc.name;
            if(!priority) priority = taskDoc.priority;

            const task = new Task(name, priority, req.user.id);
            await repository.updateTask(id, task);

            endResponse(res, 204);
        } catch (error) {
            next(error);
        }
    },
    deleteTask: async (req, res, next) => {
        const id = req.params.id;

        try {
            await repository.deleteTask(id, req.user.id);
            endResponse(res, 204);
        } catch (error) {
            next(error);
        }
    }
}