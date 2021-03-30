module.exports = app => {
    app.use((error, req, res, next) => {
        if(error instanceof Error) {
            res.status(404);
        } else {
            res.status(500);
        }

        res.send(JSON.stringify({
            menssage: error.message
        }));
    });
}

