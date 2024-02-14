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

        //check for real contributors
        let realContributors = [];
        for(let i = 0; i < contributors.length; i++){
            const temp = await User.findOne({'userID': contributors[i]});
            if(temp){
                realContributors.push(contributors[i]);
            }else{
                console.log(`User with userID ${contributors[i]} does not exist or does not use Mixers`);
            }
        }

        //create mixer
        const newMixer = await Mixer.createMixer(newPlaylistObject.id, userID, realContributors, newPlaylistObject.external_urls.spotify);

        //add new mixer id to users
        realContributors.push(userID);
        for(let i = 0; i < realContributors.length; i++){
            await User.updateMixers(realContributors[i], newMixer._id);
        }

        res.status(200).json({'mixerDetails': `${newMixer}`})
    }catch(error){
        console.log(error);
        res.status(401).json({'error': `${error}`});
    }
    
    return;
}

const getMixerInfo = async (req, res) => {
    console.log('GET MIX');

    const userID = req.userID;
    const { id } = req.params;

}

const updateMixer = async (req, res) => {
    console.log('UPDATING MIXER');
    
    const userID = req.userID;
    const playlistID = req.params.id;
    const { contributors, constituentPlaylists } = req.body;

    if(!contributors && !constituentPlaylists){
        console.log('No info to update');
        res.status(400).send('No info to update');
        return;
    }

    try{
        //grab user info
        let user = await User.findOne({userID})
        if(!user){
            throw Error('User does not exist');
        }
        //grab mixer info
        let mixer = await Mixer.findOne({playlistID});
        if(!mixer){
            throw Error('Mixer does not exist');
        }
        //check if user even has permission to edit
        if(!mixer.contributors.includes(userID) && mixer.ownerUserID != userID){
            throw Error(`${userID} is not apart of this mixer`);
        }
        //grab owner info so we can edit playlist
        let mixerOwner = await User.findOne({'userID': mixer.ownerUserID});
        if(!mixerOwner){
            throw Error('Mixer owner does not exist');
        }

        //pull and add songs from constituentPlaylists
        let songsToAdd = []
        for(let i = 0; i < constituentPlaylists.length; i++){
            songsToAdd = songsToAdd.concat(await spotify.getPlaylistSongs(constituentPlaylists[i], user.accessToken));
        }
        let songURIArray = songsToAdd.map((songObject) => {return songObject.track.uri});
        let uniqueSongURIArray = [...new Set(songURIArray)];
        await spotify.addSongsToPlaylist(mixer.playlistID, uniqueSongURIArray, mixerOwner.accessToken);

        //add contributors to mixer
        let realContributors = [];
        for(let i = 0; i < contributors.length; i++){
            const temp = await User.findOne({'userID': contributors[i]});
            if(temp){
                realContributors.push(contributors[i]);
            }else{
                console.log(`User with userID ${contributors[i]} does not exist or does not use Mixers`);
            }
        }
        let updatedMixer = await Mixer.addContributors(playlistID, realContributors);
        //add mixer to contributors

        for(let i = 0; i < realContributors.length; i++){
            await User.updateMixers(realContributors[i], mixer._id);
        }
        res.status(200).json({ 'mixerInfo:': updatedMixer })
    }catch(error){
        console.log(error);
        res.status(401).json({'error': `${error}`});
    }
    return
}

module.exports = {
    createMixer,
    getMixerInfo,
    updateMixer,
};