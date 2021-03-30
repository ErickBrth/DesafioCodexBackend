const userRoutes = require('./routes/userRoutes');
const errorMiddleware = require('./middlewares/Error');

module.exports = app => {
    userRoutes(app);
    errorMiddleware(app);
};
