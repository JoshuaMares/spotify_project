const User = require('../models/userModel.js');
const Mixer = require('../models/mixerModel.js');
const AuthCode = require('../models/authCodeModel.js');
const spotify = require('../middleware/spotifyFunctions.js');
const jwt = require('jsonwebtoken');

const createToken = (userID) => {
    return jwt.sign({'userID': userID}, process.env.SECRET, {'expiresIn': '3d'});
}

//login
const createMix = async (req, res) => {
    console.log('CREATE MIX');
    /* 
        When creating a mixer we want to
            -> create the playlist
                ->give playlist name
                ->give playlist description
            ->add the relevant music to the playlist
            ->register as a mixer in db
            ->register mixer to users
        */
    //console.log('req body: ', req.body);
    const { playlistName, playlistDesc, invitees, constituentPlaylists } = req.body;
    if(playlistName == null){
        console.log('no name');
        res.status(400).send('no name provided');
        return;
    }
    //create the playlist
    spotify.createSpotifyPlaylist()



    

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

const getUserProfile = async (req, res) => {
    console.log('GET USER PROFILE');
    //id is user we a are looking at
    //userID is user submitting request
    const { id } = req.params;
    console.log('id: ', id);
    const userID = req.userID;
    console.log('userID: ', userID);
    try{
        let { accessToken } = await User.findOne({userID}).select('accessToken');
        let profile = await getSpotifyProfile(id, accessToken);
        res.status(200).json({'profile': profile});
    }catch(error){
        console.log(error);
        res.status(401).json({'error': `${error}`});
    }

}

module.exports = {loginUser, getUserPlaylists, getUserProfile};