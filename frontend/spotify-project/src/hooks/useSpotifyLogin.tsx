import { json } from "react-router-dom";
import {useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";

const HTML_URL_SPACE_ENCODING = '%20';

/*
auth flow explained:
build custom auth request url using keys
clicking button redirects user to spotifies page
when user allows access the spotify page uses the redirect_uri we
    passed in to send us back to the mixers app with authorization code
then take code and use it to request access and refresh token
*/
/* Replace these values with your own values */
const BACKEND_URL = 'http://localhost:4000/';
const REDIRECT_URI = 'http://localhost:5173/code/';
const CLIENT_ID = 'a70182fad1a1414f9f3529dd9f018f8d';
const HOME_URL = 'http://localhost:5173/home/';
const LANDING_URL = 'http://localhost:5173/';
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize?';

//auth flow
/*
assuming we arent storing tokens
get to landing page
click on log in to spotify
user redirects to request authorization page provided by spotify
    (just need client id and permissions)
click accept which redirects back to our page with the authorization code
we then make a call to our back end passing the authorization code
our node server then uses the secret key only it has to get the tokens
the tokens are then passed back to the front end
*/

function connect(){
    let scopes = ['playlist-read-private', //read private pl
                      'playlist-read-collaborative', //read collab pl
                      'playlist-modify-private', //modify private pls
                      'playlist-modify-public', //modify public pls
                      'user-follow-read', //know which accs you follow
                      'user-top-read', //read your top songs
                      'user-read-recently-played', //read recent listening activity
                      'user-library-modify', //make playlists
                      'user-library-read', //read other items in library (likes songs, albums, podcasts, etc)
                      'user-read-private']; //read profile
        let url = AUTHORIZE_URL;
        url += "client_id=" + CLIENT_ID;
        url += "&response_type=code";
        url += "&redirect_uri=" + encodeURI(REDIRECT_URI);
        url += "&show_dialog=true";
        url += "&scope=" + scopes.join(HTML_URL_SPACE_ENCODING);
        window.location.href = url;
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if(queryString.length > 0){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
        console.log('code is: ' + code);
    }
    return code;
}

function useSpotifyLogin(){
    const [isLoading, setIsLoading] = useState<null | Boolean>(null);
    const [error, setError] = useState<null | String>(null);
    const { dispatch } = useAuthContext();

    const login = async () => {
        setIsLoading(true);
        setError(null);
        
        const code = getCode();
        if(!code){
            setIsLoading(false);
            setError("Missing authorization code, redirecting to login page.");
        }

        const abortCont = new AbortController();
        let fetchParameters = {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: ('code=' + code),
            signal: abortCont.signal
        }

        const response  = await fetch(BACKEND_URL + 'user/login', fetchParameters);
        const json = await response.json();

        if(!response.ok){
            setIsLoading(false);
            setError(json.error);
        }else{
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({'type': 'LOGIN', 'payload': json});
            setIsLoading(false);
            window.location.href = HOME_URL;
        }
    }

    return {login, isLoading, error};
}

export {connect, useSpotifyLogin};
