const db = require('../data-base/db-connection.js');
const queryStrings = require('../data-base/db-queries.js'); 
const bcrypt = require('./data-encryption.js');
const jwt = require('./jwt-module.js');

const user = {

    async insert(body, res) {

        const {username, password, email, birthdate} = body;

        if(username && password && email && birthdate){
    
            const hashedPassword = await bcrypt.generatePassword(password);
    
            // console.log(hashedPassword)
    
            try{
                const newUserId = await db.query(queryStrings.insertNewUser, [username, hashedPassword, email, birthdate]);
    
                const newToken = await jwt.generateToken(newUserId[0])
    
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
    },

    validate(body, res) {

        const {username, password, email, birthdate} = body;

        if(username && password && email && birthdate){
            let regex = /^(?=.*\d)[0-9a-zA-Z$*&@#]{8,}$/;

            if(regex.test(password)){
                console.log("Valid Password")
            }else{
                return false;
            }

            regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])+(.com)$/;

            if(regex.test(email)){
                console.log("Valid Email")
            }else{
                return false;
            }
            
            regex = /^(?:(?:1[6-9]|[2-9]\d)?\d{2})(?:(?:(\/|-|\.)(?:0?[13578]|1[02])\1(?:31))|(?:(\/|-|\.)(?:0?[13-9]|1[0-2])\2(?:29|30)))$|^(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(\/|-|\.)0?2\3(?:29)$|^(?:(?:1[6-9]|[2-9]\d)?\d{2})(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:0?[1-9]|1\d|2[0-8])$/;
    
            if(regex.test(birthdate)){
                console.log("Valid Data")
            }else{
                return false;
            }
            return true;
    
        }else{
                return false;
        }
    },

    async delete(userId, res){

        const currentUserId = userId;

        if(currentUserId){


            try{
                const removedUser = await db.query(queryStrings.deleteUserById, [currentUserId]);

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
    },

    async view(userId, res){

        const currentUserId = userId;

        if(currentUserId){


            try{
                const currentUser = await db.query(queryStrings.getUserById, [currentUserId]);

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
    },

    async update(data, userId, res){

        const newData = data;
        const currentUserId = userId;

        if(newData){


            try{

                const updateValues = queryStrings.updateData(newData, currentUserId);
                //console.log(updateValues);

                const currentUser = await db.query(updateValues.queryString, updateValues.values);

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
    }
}

module.exports = user;