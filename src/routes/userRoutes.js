const userController = require('../controller/userController');
const { Auth } = require('../util/middlewares');

module.exports = app => {
    app.route('/users')
        .post(userController.createUser);

    app.route('/users/login')
        .post(
            Auth.local,
            userController.login
        );

    app.route('/users/logout')
        .get(
            Auth.bearer,
            userController.logout
        );
};