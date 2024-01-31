const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
    console.log('REQUIRE AUTH');
    //verify authentication
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({'error': 'authorization token required'});
    }

    //'Bearer token' but only want token
    const token = authorization.split(' ')[1];

    try{
        const {userID} = jwt.verify(token, process.env.SECRET);
        let userInfo = await User.findOne({'userID': userID}).select('-_id userID');//only getting the userID property
        req.userID = userInfo.userID;
        next();
    }catch(error){
        console.log(error);
        res.status(401).json({'error': 'request is not authorized'});
    }
}

module.exports = requireAuth;