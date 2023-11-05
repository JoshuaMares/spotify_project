async function getAccessToken(clientID: string, secretClient: string){
    var authParameters = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + clientID + '&client_secret=' + secretClient
    }

    const temp = await fetch('https://accounts.spotify.com/api/token', authParameters)
    .then(result => result.json())
    .then(data => data.access_token);

    return temp;
}