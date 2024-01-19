const User = require('../models/userModel.js');
const AuthCode = require('../models/authCodeModel.js');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({'_id': _id}, process.env.SECRET, {'expiresIn': '3d'});
}

//call to get spotify tokens
const getSpotifyTokens = async (code) => {
    const authURL = 'https://accounts.spotify.com/api/token'
    const authParameters = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_keys.id + ':' + client_keys.secret).toString('base64'))
        },
        body: ('grant_type=authorization_code' 
        + '&code=' + code
        + '&redirect_uri=' + encodeURI(REDIRECT_URI)
        + '&client_id=' + clientID
        + "&client_secret=" + secretClient),
    };
    
    const tokenPackage = await fetch(authURL, authParameters)
        .then((res) => {
            console.log('token response: ', res);
            if(!res.ok){
                throw Error('Failed to fetch tokens', {'cause': res});
            }
            return data.json();
        }).then((json) => {
            return {'ok': true, ...json};
        }).catch((err) => {
            console.log('ERROR: ', err.message);
            console.log('CAUSE: ', err.cause);
            return {'ok': false};
        });
    
    return tokenPackage;
}

const spotifyAPI = async (method, url, body, accessToken) => {
    let authParameters = {
        'method': method,
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': ('Bearer ' + accessToken)
        },
        'body': body,
    };
    const payload = await fetch(authURL, authParameters)
        .then((res) => {
            if(!res.ok){
                throw Error('Failed to fetch tokens', {'cause': res});
            }
            return res.json();
        }).then((json) => {
            return {'ok': true, ...json};
        }).catch((err) => {
            console.log('ERROR: ', err.message);
            console.log('CAUSE: ', err.cause);
            return {'ok': false};
        });
    
    return payload;
}

const spotifyUserProfile = async (accessToken) => {
    return await spotifyAPI('https://api.spotify.com/v1/me', 'GET', null, accessToken);
}

//login
const loginUser = async (req, res) => {
    //message comes in with auth code
    console.log('req body: ', req.body);
    const { code } = req.body;
    if(code == null){
        res.status(400).send('no code provided');
        return;
    }
    console.log('code: ', code);
    try{
        await AuthCode.registerCode(code);
    }catch{
        if(error.message !== 'Used Code'){
            res.status(400).json({'error': error.message});
        }
        return;
    }
    //get tokens using auth code
    const tokenPackage = await getSpotifyTokens(code);
    if(!tokenPackage.ok){
        res.status(400).json({'error': 'Error retrieving tokens'});
    }
    console.log(tokenPackage);

    //get spotify user profile with token
    const userInfo = await spotifyUserProfile(tokenPackage.access_token);
    if(!userInfo.ok){
        res.status(400).json({'error': 'Error pulling user info'});
        return;
    } 
    console.log('userInfo: ', userInfo);

    //has this user used our app before
    try{
        const user = await User.info(userInfo.id);
        if(user){
            //yes?, update our stored spotify tokens
            user = await User.updateSpotifyTokens(userInfo.id, tokenPackage.access_token, tokenPackage.refresh_token);
        }else{
            //no?, create the user
            user = await User.createUser(userInfo.display_name, userInfo.id, tokenPackage.access_token, tokenPackage.refresh_token);
        }
        //create new token
        const token = createToken(user.userID);
        res.status(200).json({'userID': user.userID, 'jwt': token});
        return;
    }catch{
        res.status(400).json({'error': error.message});
        return;
    }
}











//sign up
const signupUser = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.signup(email, password);
        const token = createToken(user._id);
        res.status(200).json({email, token});
    } catch(error){
        //'Used Code' is a duplicate request and should be thrown out
        if(error.message !== 'Used Code'){
            res.status(400).json({'error': error.message});
        }
    }

}

module.exports = {loginUser};