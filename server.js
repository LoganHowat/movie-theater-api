const express = require("express");
const app = express();
const {db} = require("./db")
const seed = require('./seed')
seed();
const { Show, User } = require('./models/index');
const { request, response } = require("express");

const port = 3000;

const usersRouter = require("./routers/users")
const showsRouter = require("./routers/shows")

app.use("/users", usersRouter)
app.use("/shows", showsRouter)

app.listen(port, () => {
    db.sync();
    console.log(`Listening on port ${port}`)
})