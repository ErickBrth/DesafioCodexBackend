require('dotenv').config();

const app = require('./app.js');
const config = require('./config');
const dataBaseConfig = require("./config/database");
const routes = require('./routes');

async function startServer() {
    dataBaseConfig();

    routes(app);

    app.listen(config.app.port, (err) => {
        if(err) {
            return console.log(err);
        }

        console.log(`Server is up on port ${config.app.port}`);
    });
}

startServer();

module.exports = app;