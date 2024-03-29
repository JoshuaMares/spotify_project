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

const createSpotifyPlaylist = async (userID, playlistName, playlistDesc, accessToken) => {
    let url = `https://api.spotify.com/v1/users/${userID}/playlists`;
    let body = {
        'name': playlistName,
        'public': false,
        'collaborative': true,
        'description': playlistDesc, 
    };
    let playlistObject = await spotifyAPI(url, 'POST', JSON.stringify(body), accessToken);
    return playlistObject;
}

const getPlaylistInfo = async (playlistID, accessToken) => {
    let url = `https://api.spotify.com/v1/playlists/${playlistID}`;
    let playlistObject = await spotifyAPI(url, 'GET', null, accessToken)
    return playlistObject;
}

const getPlaylistSongs = async (playlistID, accessToken) => {
    let url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?limit=50`;
    let songsArray = [];
    while(url){
        let tracksObject = await spotifyAPI(url, 'GET', null, accessToken)
        songsArray = songsArray.concat(tracksObject.items);
        url = tracksObject.next;
    }
    return songsArray;
}

const addSongsToPlaylist = async (playlistID, songURIList, accessToken) => {
    let url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
    const SIZE = 100;

    for (let i=0; i < songURIList.length; i+=SIZE) {
        let batch = songURIList.slice(i,i+SIZE);
        let body = {
            'uris': batch,
        };
        let response = await spotifyAPI(url, 'POST', JSON.stringify(body), accessToken);
    }
    return;
}

const spotifyUserProfile = async (accessToken) => {
    return await spotifyAPI('https://api.spotify.com/v1/me', 'GET', null, accessToken);
}

const getSpotifyProfile = async (id, accessToken) => {
    return await spotifyAPI(`https://api.spotify.com/v1/users/${id}`, 'GET', null, accessToken)
}

module.exports = {
    getSpotifyTokens,
    getSpotifyPlaylists,
    spotifyUserProfile,
    getSpotifyProfile,
    createSpotifyPlaylist,
    getPlaylistSongs,
    addSongsToPlaylist,
    getPlaylistInfo,
}