const User = require('../models/userModel.js');
const Mixer = require('../models/mixerModel.js');
const AuthCode = require('../models/authCodeModel.js');
const spotify = require('../middleware/spotifyFunctions.js');
const jwt = require('jsonwebtoken');

const createToken = (userID) => {
    return jwt.sign({'userID': userID}, process.env.SECRET, {'expiresIn': '3d'});
}

const createMixer = async (req, res) => {
    console.log('CREATE MIX');

    const userID = req.userID;
    const { playlistName, playlistDesc, contributors, constituentPlaylists } = req.body;
    if(playlistName == null){
        console.log('no name');
        res.status(400).send('no name provided');
        return;
    }

    try{
        let { accessToken } = await User.findOne({userID}).select('accessToken');

        //create the playlist
        let newPlaylistObject = await spotify.createSpotifyPlaylist(userID, playlistName, playlistDesc, accessToken);

        //grab all songs in constituentPlaylists
        let songsToAdd = []
        for(let i = 0; i < constituentPlaylists.length; i++){
            songsToAdd = songsToAdd.concat(await spotify.getPlaylistSongs(constituentPlaylists[i], accessToken));
        }
        let songURIArray = songsToAdd.map((songObject) => {return songObject.track.uri});
        let uniqueSongURIArray = [...new Set(songURIArray)];

        //add songs to playlist
        await spotify.addSongsToPlaylist(newPlaylistObject.id, uniqueSongURIArray, accessToken);

        const newMixer = await Mixer.createMixer(newPlaylistObject.id, userID, contributors, newPlaylistObject.external_urls.spotify);
        await User.updateMixers(userID, newMixer._id);
        //add this logic for all invitees
        //also check if they even exist
        res.status(200).json({'link': `${newMixer.playlistURL}`})
    }catch(error){
        console.log(error);
        res.status(401).json({'error': `${error}`});
    }
    
    return
}

const getMixerInfo = async (req, res) => {
    console.log('GET MIX');

    const userID = req.userID;

}

const addUsers = async (req, res) => {
    console.log('ADD USERS TO MIX');
    
    const userID = req.userID;

}

const addPlaylists = async (req, res) => {
    console.log('ADD PLAYLISTS TO MIX');
    
    const userID = req.userID;

}


module.exports = {
    createMixer,
    getMixerInfo,
    addUsers,
    addPlaylists,
};