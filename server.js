const dotenv = require("dotenv");
const mongoose = require('mongoose');
// for catching uncauthException
process.on('uncaughtException', err => {
    console.log(err);
    console.log(err.name, err.message);
    console.log('Uncaught exception!, shutting down....');
    process.exit(1);
});
dotenv.config({ path: "./config.env" });
const app = require("./app");
const DB = process.env.DB_LOCAL;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('connection successful')
});
const port = 3000;
// create server
const server = app.listen(port, () => {
    console.log("server started at port" + port);
});
//for catching unhandled promise rejection
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection!, shutting down....')
    server.close(() => {
        process.exit(1);
    });
});