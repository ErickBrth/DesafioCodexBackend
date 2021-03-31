const taskController = require('../controller/taskController.js')

module.exports = app => {
    app.route('/tasks')
        .post(taskController.createTask)
        .get(taskController.listTasks);

    app.route('/task/:id')
        .put(taskController.updateTask)
        .delete(taskController.deleteTask);
}