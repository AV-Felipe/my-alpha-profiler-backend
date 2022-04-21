const jwt = require('../modules/jwt-module.js');

async function cookieValidation(req, res, next){
    
    const receivedToken = req.cookies.access_token;

    const requestedRoute = req.originalUrl;


    // Only allow requests to login or user creation endpoints without token
    if(!receivedToken && (requestedRoute != '/session/login' && requestedRoute != '/user/create')){
        console.log(requestedRoute);
        console.log(receivedToken);
        return res.sendStatus(403);
    }else if(requestedRoute === '/session/login' || requestedRoute === '/user/create'){
        return next();
    }

    try{
        const tokenData = await jwt.verifyToken(receivedToken);
        console.log(tokenData);
        return next();
    }catch(e){
        console.log(e)
        return res.sendStatus(403);
    }
    
}

module.exports = cookieValidation