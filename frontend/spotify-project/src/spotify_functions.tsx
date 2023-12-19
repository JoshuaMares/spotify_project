import { json } from "react-router-dom";
import {useState, useEffect } from "react";
const HTML_URL_SPACE_ENCODING = '%20';

/*
auth flow explained:
build custom auth request url using keys
clicking button redirects user to spotifies page
when user allows access the spotify page uses the redirect_uri we
    passed in to send us back to the mixers app with authorization code
then take code and use it to request access and refresh token
*/

const BACKEND_URL = 'http://localhost:4000/';
const REDIRECT_URI = 'http://localhost:5173/loading/';
const HOME_URL = 'http://localhost:5173/home/';
const LANDING_URL = 'http://localhost:5173/';
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize?';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const CLIENT_ID = 'a70182fad1a1414f9f3529dd9f018f8d';

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

function requestAuthorization(){
    //scopes are permissions we want
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
    //look into state parameter   
}

function useTokens(){
    useEffect(() => {
        if(window.location.search.length > 0){
            let code = getCode();
            const abortCont = new AbortController();
            let fetchParameters = {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: ('code=' + code),
                signal: abortCont.signal
            }
            console.log('fetchParameters: ', fetchParameters);
            fetch(BACKEND_URL + 'callback', fetchParameters)
            .then(result => {
                if(!result.ok){
                    throw Error('could not fetch data for that resource');
                }
                return result.json()
            }).then(data => {
                localStorage.setItem("accessToken", data.access_token);
                console.log("accessToken: " + data.access_token);
                localStorage.setItem("refreshToken", data.refreshToken);
                console.log("refreshToken: " + data.refresh_token);
                window.location.href = HOME_URL; 
                //window.history.pushState("", "", REDIRECT_URI);
            }).catch(err => {
                if(err.name === 'AbortError'){
                    console.log('fetch aborted while getting tokens');
                }else{
                    console.log(err.message);
                    alert(err.message);
                }
            });
            return () => abortCont.abort();
        }
    }, []);
}

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
                throw Error('could not fetch data for that resource');
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

export {requestAuthorization, useTokens, useSpotify};
