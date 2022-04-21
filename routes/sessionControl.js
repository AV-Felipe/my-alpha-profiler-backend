const express = require('express');
const router = express.Router();
const db = require('../data-base/db-connection.js');
const queryStrings = require('../data-base/db-queries.js'); 
const bcrypt = require('../modules/data-encryption.js');
const jwt = require('../modules/jwt-module.js');


// router.get('/', async (req, res)=>{
//     res.status(200);
//     res.type('application/json');
//     res.send('{"endpoint": "ok"}');
// })

// Verifies provided email and password against db an returns a session cookie if ok
router.post('/login', async (req, res)=>{
    console.log(req.body);
    
    const {email, password} = req.body; // destructuring the object

    if(email && password){

        try{

            let data = await db.query(queryStrings.getUserFullData, [email]);
            data = data[0];
            console.log(data);

            const passwordMatch = await bcrypt.checkPassword(password, data.password);
            console.log(passwordMatch);

            if(passwordMatch){

                const newToken = await jwt.generateToken({'id': data.id})
                //console.log(newToken);

                res.status(200);
                res.cookie('access_token', newToken);
                res.type('application/json');
                res.send(`{"username": "${data.username}"}`);
                return;
            }else{
                res.status(401);
                res.type('application/json');
                res.send(`{"error": "invalid username or password"}`);                
            }

        }catch(e){
            console.log(e)
            res.status(400);
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