module.exports = {
    app : {
        port : process.env.PORT,
        node_env: "dev"
    },
    db : {
        production : process.env.DB_URL_PROD,
        develop: process.env.DB_URL_DEV,
    }
};