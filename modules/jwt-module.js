const jwt = require('jsonwebtoken');

const privateKey = 'top_secret';

const expiration = {expiresIn: '12h'};

module.exports = {
    async generateToken(payLoad){
        return jwt.sign(payLoad, privateKey, expiration);
    },

    async verifyToken(token){
        try{
            const returnValue = jwt.verify(token, privateKey, function(err, decoded){
                if(err){
                    throw err.name
                }else{
                    return decoded
                }
            });
            return returnValue;
        }catch(e){
            throw e;
        }
         
    }
}