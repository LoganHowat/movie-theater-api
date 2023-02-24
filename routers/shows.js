const express = require("express");
const { Show, User } = require('../models/index');
const { request, response } = require("express");
const router = express.Router()
const {check, validationResult} = require("express-validator");

router.use(express.json())

//Gets all shows in a specific genre
router.get('/genre/:genre',async (request,response) =>{
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

//All shows
router.get('/',async (request,response) =>{
    try{
        let show_data = await Show.findAll();
        response.send(show_data);
    }catch(error){
        response.status(404).send({err:error.message})
    }
});

//One show by id
router.get('/:id',async (request,response) =>{
    try{
        const show = await Show.findByPk(request.params.id);
        if (!show){
            throw new Error("Cannot find show")
        }
        response.send(show);
    }catch(error){
        response.status(404).send({err:error.message})
    }
});

//This will delete a show based on its id
router.delete('/:id', async(request, response) => {
    try{
        let show = await Show.findByPk(request.params.id);
        await Show.destroy({
            where:{
                id:(request.params.id)
            },
            force:true
        });
        if (!show){
            throw new Error("Cannot find show")
        }
        response.send("DELETED SHOW")
    }catch(error){
        response.status(404).send({err:error.message})
    }
 });

  // Update the rating of a show
router.put('/:id/rating', [check("rating").not().isEmpty()],async(request,response) => {
    try{
        const errors = validationResult(request);
        if(!errors.isEmpty()){//Checks that the rating input is not empty
            response.json({error: errors.array()})
        }else{
            let show = await Show.findByPk(request.params.id);
            if (!show){//This checks that the show actually exists
                throw new Error("Cannot find show")
            }
            show.update(request.body);//If the rating is put in and the show exists it updates the rating 
            response.send("Show rating has been UPDATED")
        }
    }catch(error){
        response.status(404).send({err:error.message})
    }
});

//Updating the status of the show (either on-giong or cancelled)
router.put('/:id/status', [check("status").not().isEmpty().trim().isLength({min:5, max:25})], async(request,response) => {
    try{
        const errors = validationResult(request);
        if(!errors.isEmpty()){//Checks that the status input is not empty
            response.json({error: errors.array()})
        }else{
            let show = await Show.findByPk(request.params.id);
            if (!show){//Checks that the show exists
                throw new Error("Cannot find show")
            }
            show.update(request.body);//If the show exists and the input is not empty then update the status
            response.send("Show status has been UPDATED")
        }
    }catch(error){
        response.status(404).send({err:error.message})
    }
});

module.exports = router;
