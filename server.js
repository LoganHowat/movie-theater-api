const express = require("express");
const app = express();
const {db} = require("./db")
const seed = require('./seed')
seed();
const { Show, User } = require('./models/index')

const port = 3000;

//Gets all shows in a specific genre
app.get('/shows/genre/:genre',async (request,response) =>{
    try{
    const genre = await Show.findAll({
        where:{
            genre: (request.params.genre)
        }
    });
    if (genre.length<1){
        throw new Error("No movies in genre: "+request.params.genre)
    }
    response.send(genre)
    }catch(error){
        response.status(404).send({err:error.message})
    }
})

//All users
app.get('/users',async (request,response) =>{
    try{
    let user_data = await User.findAll();
    response.send(user_data);
    }catch(error){
        response.status(404).send({err:error.message})
    }
})

//One user by id
app.get('/users/:id',async (request,response) =>{
    try{
        const user = await User.findByPk(request.params.id);
        if (!user){
            throw new Error("Cannot find user")
        }
        response.send(user);
    }catch(error){
        response.status(404).send({err:error.message})
    }
})


//All shows
app.get('/shows',async (request,response) =>{
    try{
        let show_data = await Show.findAll();
        response.send(show_data);
    }catch(error){
        response.status(404).send({err:error.message})
    }
})

//One show by id
app.get('/shows/:id',async (request,response) =>{
    try{
        const show = await Show.findByPk(request.params.id);
        if (!show){
            throw new Error("Cannot find show")
        }
        response.send(show);
    }catch(error){
        response.status(404).send({err:error.message})
    }
})

//Shows watched by one user
app.get('/users/:id/watched',async (request,response) =>{
    try{
        const watched = await User.findAll({
            where:{
                id: (request.params.id)
            },
            include: [
                { model: Show}
            ]
        });
        if (!watched){
            throw new Error("Cannot find user")
        }
        response.send(watched[0].dataValues.shows)
    }catch(error){
        response.status(404).send({err:error.message})
    }
})

//This will delete a show based on its id
app.delete('/shows/:id', async(request, response) => {
    try{
        let show = await Show.findAll({where:{id:(request.params.id)}})
        await Show.destroy({
            where:{
                id:(request.params.id)
            },
            force:true
        });
        if (!show){
            throw new Error("Cannot find show")
        }
        response.send("DELETED SHOW:"+ show[0].dataValues.title)
    }catch(error){
        response.status(404).send({err:error.message})
    }
 });

app.listen(port, () => {
    db.sync();
    console.log(`Listening on port ${port}`)
})