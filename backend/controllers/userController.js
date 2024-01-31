const User = require('../models/userModel.js');
const AuthCode = require('../models/authCodeModel.js');
const jwt = require('jsonwebtoken');

const createToken = (userID) => {
    return jwt.sign({'userID': userID}, process.env.SECRET, {'expiresIn': '3d'});
}

//call to get spotify tokens
const getSpotifyTokens = async (code) => {
    const authURL = 'https://accounts.spotify.com/api/token'
    const authParameters = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_ID + ':' + process.env.SPOTIFY_SECRET).toString('base64'))
        },
        body: ('grant_type=authorization_code' 
        + '&code=' + code
        + '&redirect_uri=' + encodeURI("http://localhost:5173/code/")
        + '&client_id=' + process.env.SPOTIFY_ID
        + "&client_secret=" + process.env.SPOTIFY_SECRET),
    };
    
    const tokenPackage = await fetch(authURL, authParameters)
        .then((res) => {
            console.log('token response: ', res);
            if(!res.ok){
                throw Error('Failed to fetch tokens', {'cause': res});
            }
            return res.clone().json();
        }).then((json) => {
            return {'ok': true, ...json};
        }).catch((err) => {
            console.log('ERROR: ', err.message);
            console.log('CAUSE: ', err.cause);
            return {'ok': false};
        });
    
    return tokenPackage;
}

const spotifyAPI = async (url, method, body, accessToken) => {
    let fetchParameters = {
        'method': method,
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': ('Bearer ' + accessToken)
        },
        'body': body,
    };
    const payload = await fetch(url, fetchParameters)
        .then((res) => {
            if(!res.ok){
                throw Error(`Failed to fetch resources from ${url}`, {'cause': res});
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

const getSpotifyPlaylists = async (userID, accessToken) => {
    let url = `https://api.spotify.com/v1/users/${userID}/playlists`;
    let playlistArray = [];
    while(url){
        let playlistObject = await spotifyAPI(url, 'GET', null, accessToken)
        playlistArray = playlistArray.concat(playlistObject.items);
        url = playlistObject.next;
    }
    return playlistArray;
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
        console.log('no code');
        res.status(400).send('no code provided');
        return;
    }
    console.log('code: ', code);

    try{
        await AuthCode.registerCode(code);
    }catch(error){
        console.log('used code');
        if(error.message !== 'Used Code'){
            res.status(400).json({'error': error.message});
        }
        return;
    }
    //get tokens using auth code
    const tokenPackage = await getSpotifyTokens(code);
    if(!tokenPackage.ok){
        console.log('error retrieving tokens');
        res.status(400).json({'error': 'Error retrieving tokens'});
        return;
    }
    console.log(tokenPackage);

    //get spotify user profile with token
    const userInfo = await spotifyUserProfile(tokenPackage.access_token);
    if(!userInfo.ok){
        console.log('error pulling user info');
        res.status(400).json({'error': 'Error pulling user info'});
        return;
    } 
    console.log('userInfo: ', userInfo);

    //has this user used our app before
    try{
        let user = await User.info(userInfo.id);
        if(user){
            //yes?, update our stored spotify tokens
            console.log(`user ${user.userName} exists, updating tokens`);
            user = await User.updateSpotifyTokens(userInfo.id, tokenPackage.access_token, tokenPackage.refresh_token);
            console.log(`updated tokens`);
        }else{
            //no?, create the user
            console.log(`user does not exist, creating user in db`);
            user = await User.createUser(userInfo.display_name, userInfo.id, tokenPackage.access_token, tokenPackage.refresh_token);
            console.log(`created user ${user.userName}`);
        }
        //create new token
        const token = createToken(user.userID);
        console.log('jwt: ', token);
        data = {'userID': user.userID, 'userName': user.userName, 'jwt': token}
        res.status(200).send(data);
        console.log('sent response');
        return;
    }catch(error){
        res.status(400).json({'error': error.message});
        console.log('error');
        return;
    }
}

const getUserPlaylists = async (req, res) => {
    console.log('GET USER PLAYLISTS');
    //id is user we a are looking at
    //userID is user submitting request
    const { id } = req.params;
    console.log('id: ', id);
    const userID = req.userID;
    console.log('userID: ', userID);
    try{
        let { accessToken } = await User.findOne({userID}).select('accessToken');
        let playlists = await getSpotifyPlaylists(id, accessToken);
        res.status(200).json({'playlists': playlists});
    }catch(error){
        console.log(error);
        res.status(401).json({'error': `${error}`});
    }

}

module.exports = {loginUser, getUserPlaylists};