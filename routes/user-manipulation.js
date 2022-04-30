const express = require('express');
const router = express.Router();
const db = require('../data-base/db-connection.js');
const queryStrings = require('../data-base/db-queries.js'); 
const bcrypt = require('../modules/data-encryption.js');
const jwt = require('../modules/jwt-module.js');
const user = require ('../modules/profiler.js');


// Return all active users
router.get('/', async (req, res)=>{

    const userList = await db.query(queryStrings.listAllUsers);

    res.status(200);
    res.type('application/json');
    res.json(userList);
})

// create a new user returning its id
router.post('/create', async (req, res)=>{

    if(user.validate(req.body, res)){
        user.insert(req.body, res);
    }

})


// remove the user based on the session token id information
router.delete('/remove', async (req, res)=>{

    //console.log(req.body);

    const receivedToken = await jwt.verifyToken(req.cookies.access_token);
    console.log(receivedToken);
    const currentUserId = receivedToken.id;
    console.log(currentUserId);

    user.delete(currentUserId, res);

})

// get the current user data based on the session token id information
router.get('/current', async (req, res)=>{

    //console.log(req.body);

    const receivedToken = await jwt.verifyToken(req.cookies.access_token);
    console.log(receivedToken);
    const currentUserId = receivedToken.id;
    console.log(currentUserId);

    user.view(currentUserId, res);

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

    user.update(newData, currentUserId, res);

})


module.exports = router;