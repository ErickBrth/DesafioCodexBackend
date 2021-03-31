const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes.js');
const { ErrorMiddleware, FormatValidator } = require('./util/middlewares');

module.exports = app => {
    FormatValidator(app);
    userRoutes(app);
    taskRoutes(app);
    ErrorMiddleware(app);
};