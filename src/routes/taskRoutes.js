const taskController = require('../controller/taskController.js')
const {Auth}=require("../util/middlewares");

module.exports = app => {
    app.route('/tasks')
        .post(
            Auth.bearer,
            taskController.createTask
        )
        .get(
            Auth.bearer,
            taskController.listTasks
        );

    app.route('/task/:id')
        .put(
            Auth.bearer,
            taskController.updateTask
        )
        .delete(
            Auth.bearer,
            taskController.deleteTask
        );
}