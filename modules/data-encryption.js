const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {

    async checkPassword(plainTextPassword, hashedPassword){

        return new Promise(function(resolve, reject) {

            bcrypt.compare(plainTextPassword, hashedPassword, function(err, res) {
                if (err) {
                     reject(err);//false
                } else {
                     resolve(res);//true
                }
            });
        });
    },

    async generatePassword(plainTextPassword){


        const newPassword = plainTextPassword
      
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(newPassword, saltRounds, function(err, hash) {
                if (err){
                    reject(err);
                }else{
                    resolve(hash);
                }
            
            });
        })
      
        return hashedPassword
    }
}