import { json } from "react-router-dom";
import {clientID, secretClient} from "../../spotify_keys.ts"
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

const REDIRECT_URI = 'http://localhost:5173/loading/';
const HOME_URL = 'http://localhost:5173/home/';
const LANDING_URL = 'http://localhost:5173/';
const AUTHORIZE_URL = 'https://accounts.spotify.com/authorize?';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

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
                  'user-read-private'] //read profile
    let url = AUTHORIZE_URL;
    url += "client_id=" + clientID;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(REDIRECT_URI);
    url += "&show_dialog=true";
    url += "&scope=" + scopes.join(HTML_URL_SPACE_ENCODING);
    window.location.href = url;   
}

function useTokens(){
    useEffect(() => {
        if(window.location.search.length > 0){
            let code = getCode();
            const abortCont = new AbortController();
            let authParameters = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(clientID + ':' + secretClient)
                },
                body: ('grant_type=authorization_code' 
                    + '&code=' + code
                    + '&redirect_uri=' + encodeURI(REDIRECT_URI)
                    + '&client_id=' + clientID
                    + "&client_secret=" + secretClient),
                signal: abortCont.signal
            }
            fetch(TOKEN_URL, authParameters)
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
