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
/*
function getLocalStorageAccessToken(){
    let lsat = localStorage.getItem('accessToken');
    if(lsat !== null){
        return lsat;
    }else{
        window.location.href = LANDING_URL;
        return '';
    }
}

const useSpotify = (url: string, method: string, body: string | null) => {
    const [data, setData] = useState<any>(null);
    const [isPending, setIsPending] = useState<boolean>(true);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    
    let spotifyObject = {data, setData, isPending, setIsPending, isFinished, setIsFinished, error, setError};

    useEffect(() => {
        if(data && !data.next){
            //if we already have the data and there is no more data to grab
            setIsFinished(true);
            return () => console.log('no more data to grab');
        }else if(data && data.next){
            //we have already gotten some data but still need more
            url = data.next;
        }
        let accessToken = getLocalStorageAccessToken();
        if(accessToken == ''){
            return () => console.log('cannot find access token, going to login for oauth');
        }
        const abortCont = new AbortController();
        let authParameters = {
            'method': method,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': ('Bearer ' + accessToken)
            },
            'body': body,
            'signal': abortCont.signal
        };
        spotifyAPI(url, authParameters, spotifyObject);
        return () => abortCont.abort();
    }, [data]);

    return spotifyObject;
}

function spotifyAPI(url: string, authParameters: any, stateObject: any){
    fetch(url, authParameters)
        .then(result => {
            if(!result.ok){
                throw Error('spotifyAPI: could not fetch data for that resource');
            }
            return result.json()
        }).then(data => {
            if(stateObject.data && data.items){
                stateObject.setData((prevState: any) => ({
                    ...data,
                    'items': (prevState.items.concat(data.items))
                }))
            }else{
                stateObject.setData(data);
            }
            console.log('data: ' + JSON.stringify(data));
            stateObject.setIsPending(false);
            stateObject.setError(null);
        }).catch(err => {
            if(err.name === 'AbortError'){
                console.log('fetch aborted while calling spotify api');
            }else{
                stateObject.setData(null)
                stateObject.setIsPending(false);
                stateObject.setError(err.message);
            }
        });
}
*/
export {connect, useSpotifyLogin};
