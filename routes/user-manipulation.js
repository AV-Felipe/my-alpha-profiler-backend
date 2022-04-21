const express = require('express');
const router = express.Router();
const db = require('../data-base/db-connection.js');
const queryStrings = require('../data-base/db-queries.js'); 
const bcrypt = require('../modules/data-encryption.js');
const jwt = require('../modules/jwt-module.js');


// Return all active users
router.get('/', async (req, res)=>{

    const userList = await db.query(queryStrings.listAllUsers);

    res.status(200);
    res.type('application/json');
    res.json(userList);
})

// create a new user returning its id
router.post('/create', async (req, res)=>{

    console.log(req.body);

    const {username, password, email, birthdate} = req.body;

    if(username && password && email && birthdate){

        const hashedPassword = await bcrypt.generatePassword(password);

        // console.log(hashedPassword)

        try{
            const newUserId = await db.query(queryStrings.insertNewUser, [username, hashedPassword, email, birthdate]);
            console.log(newUserId);

            const newToken = await jwt.generateToken({'id': newUserId[0]})

            res.status(201);
            res.cookie('access_token', newToken);
            res.type('application/json');
            res.json(newUserId[0]);

            return;

        }catch(err){
            console.log(err)

            res.status(409);
            res.type('application/json');
            res.send(`{"error": "this person or username already exists"}`);
            
            return;
        }




    }else{
        res.status(400);
        res.send();
        return;
    }

})


// remove the user based on the session token id information
router.delete('/remove', async (req, res)=>{

    console.log(req.body);

    const receivedToken = await jwt.verifyToken(req.cookies.access_token);
    console.log(receivedToken);
    const currentUserId = receivedToken.id;
    console.log(currentUserId);

    if(currentUserId){


        try{
            const removedUser = await db.query(queryStrings.deleteUserById, [currentUserId]);
            console.log(removedUser);

            res.status(200);
            res.type('application/json');
            res.json(removedUser[0]);

            return;

        }catch(err){
            console.log(err)

            res.status(409);
            res.type('application/json');
            res.send(`{"error": "something went wrong"}`);
            
            return;
        }




    }else{
        res.status(400);
        res.send();
        return;
    }

})

// get the current user data based on the session token id information
router.get('/current', async (req, res)=>{

    //console.log(req.body);

    const receivedToken = await jwt.verifyToken(req.cookies.access_token);
    console.log(receivedToken);
    const currentUserId = receivedToken.id;
    console.log(currentUserId);

    if(currentUserId){


        try{
            const currentUser = await db.query(queryStrings.getUserById, [currentUserId]);
            console.log(currentUser);

            res.status(200);
            res.type('application/json');
            res.json(currentUser[0]);

            return;

        }catch(err){
            console.log(err)

            res.status(409);
            res.type('application/json');
            res.send(`{"error": "something went wrong"}`);
            
            return;
        }




    }else{
        res.status(400);
        res.send();
        return;
    }

})

// remove the user based on the session token id information
router.delete('/remove', async (req, res)=>{

    console.log(req.body);

    const receivedToken = await jwt.verifyToken(req.cookies.access_token);
    console.log(receivedToken);
    const currentUserId = receivedToken.id;
    console.log(currentUserId);

    if(currentUserId){


        try{
            const removedUser = await db.query(queryStrings.deleteUserById, [currentUserId]);
            console.log(removedUser);

            res.status(200);
            res.type('application/json');
            res.json(removedUser[0]);

            return;

        }catch(err){
            console.log(err)

            res.status(409);
            res.type('application/json');
            res.send(`{"error": "something went wrong"}`);
            
            return;
        }




    }else{
        res.status(400);
        res.send();
        return;
    }

})

// update the current user data based on the session token id and the request body data
//request keys must match the db desired columns
router.put('/current', async (req, res)=>{

    const receivedToken = await jwt.verifyToken(req.cookies.access_token);
    //console.log(receivedToken);
    const currentUserId = receivedToken.id;
    //console.log(currentUserId);

    const newData = req.body;
    //console.log(req.body);

    if(newData){


        try{

            const updateValues = queryStrings.updateData(newData, currentUserId);
            //console.log(updateValues);

            const currentUser = await db.query(updateValues.queryString, updateValues.values);
            console.log(currentUser);

            res.status(200);
            res.type('application/json');
            res.json(currentUser[0]);

            return;

        }catch(err){
            console.log(err)

            res.status(409);
            res.type('application/json');
            res.send(`{"error": "something went wrong"}`);
            
            return;
        }




    }else{
        res.status(400);
        res.send();
        return;
    }

})


module.exports = router;