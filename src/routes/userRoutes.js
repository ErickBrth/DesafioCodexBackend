const userController = require('../controller/userController');

module.exports = app => {
    app.route('/users')
        .post(userController.addUser);
};

