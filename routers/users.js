const express = require("express");
const { Show, User } = require('../models/index');
const { request, response } = require("express");
const router = express.Router()
const {check, validationResult} = require("express-validator");

router.use(express.json())

//All users
router.get('/',async (request,response) =>{
    try{
    let user_data = await User.findAll();
    response.send(user_data);
    }catch(error){
        response.status(404).send({err:error.message})
    }
});

//One user by id
router.get('/:id',async (request,response) =>{
    try{
        const user = await User.findByPk(request.params.id);
        if (!user){
            throw new Error("Cannot find user")
        }
        response.send(user);
    }catch(error){
        response.status(404).send({err:error.message})
    }
});

//Shows watched by one user
router.get('/:id/watched',async (request,response) =>{
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
});

//Adding a show to a Users watchlist
router.put('/:id/addshow/:showid', async(request,response) => {
    try{
        let user = await User.findByPk(request.params.id)
        let show = await Show.findByPk(request.params.showid);
        if (!show){
            throw new Error("Cannot find show")
        }
        if (!user){
            throw new Error("Cannot find user")
        }
        await user.addShow(request.params.showid)
        response.send("Show has been added to user")
    }catch(error){
        response.status(404).send({err:error.message})
    }
});

module.exports = router;