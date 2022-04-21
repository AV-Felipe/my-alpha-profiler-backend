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
                console.log(newUserId);
    
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

    async delete(userId, res){

        const currentUserId = userId;

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
    },

    async view(userId, res){

        const currentUserId = userId;

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
    },

    async update(data, userId, res){

        const newData = data;
        const currentUserId = userId;

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
    }
}

module.exports = user;