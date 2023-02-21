const express = require("express");
const app = express();
const {db} = require("./db")
const seed = require('./seed')
seed();
const { Show, User } = require('./models/index')

const port = 3000;

app.get('/shows/genre/:genre',async (request,response) =>{
    const genre = await Show.findAll({
        where:{
            genre: (request.params.genre)
        }
    });
    response.send(genre)
})

//All users
app.get('/users',async (request,response) =>{
    let user_data = await User.findAll();
    response.send(user_data);
})

//One user by id
app.get('/users/:id',async (request,response) =>{
    const user = await User.findByPk(request.params.id);
    response.send(user);
})


//All shows
app.get('/shows',async (request,response) =>{
    let show_data = await Show.findAll();
    response.send(show_data);
})

//One show by id
app.get('/shows/:id',async (request,response) =>{
    const show = await Show.findByPk(request.params.id);
    console.log('test')
    response.send(show);
})

//Shows watched by one user
app.get('/users/:id/watched',async (request,response) =>{
    const watched = await User.findAll({
        where:{
            id: (request.params.id)
        },
        include: [
            { model: Show}
        ]
    });
    response.send(watched[0].dataValues.shows)
})


app.listen(port, () => {
    db.sync();
    console.log(`Listening on port ${port}`)
})