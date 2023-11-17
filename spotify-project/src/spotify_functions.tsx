import {clientID, secretClient} from "../../spotify_keys.ts"
import {useState, useEffect } from "react";
const HTML_URL_SPACE_ENCODING = '%20';

//getting authorization for access to current users account
/*
auth flow explained:
build custom auth request url using keys
clicking button redirects user to spotifies page
when user allows access the spotify page uses the redirect_uri we
    passed in to send us back to the mixers app

*/
const REDIRECT_URI = "http://localhost:5173/home/";
const AUTHORIZE_URL = "https://accounts.spotify.com/authorize?";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

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

const useTokens = () => {
    const [accessToken, setAccess] = useState<string>('');
    const [refreshToken, setRefresh] = useState<string>('');
    const [isPending, setIsPending] = useState<any>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        const abortCont = new AbortController();
        let lsat = JSON.parse(localStorage.getItem('accessToken'));
        let lsrt = JSON.parse(localStorage.getItem('refreshToken'));
        if(lsat !== null){
            setAccess(lsat);
            setRefresh(lsrt);
            setIsPending(false);
            setError(null);
        }else{
            let authParameters = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + btoa(clientID + ':' + secretClient)
                },
                body: ('grant_type=authorization_code' 
                    + '&code=' + getCode()
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
                    setAccess(data.access_token);
                    console.log("access_token: " + data.access_token);
                    setRefresh(data.access_token);
                    console.log("refresh_token: " + data.refresh_token);
                    window.history.pushState("", "", REDIRECT_URI);
                    setIsPending(false);
                    setError(null);
                }).catch(err => {
                    if(err.name === 'AbortError'){
                        console.log('fetch aborted');
                    }else{
                        setIsPending(false);
                        setError(err.message);
                    }
                });
            
            // let body = 'grant_type=authorization_code';
            // body += "&code=" + getCode();
            // body += "&redirect_uri=" + encodeURI(REDIRECT_URI);
            // body += "&client_id=" + clientID;
            // body += "&client_secret=" + secretClient;
            // console.log('body is: ' + body);
            // let xhr = new XMLHttpRequest();
            // xhr.open("POST", TOKEN_URL, true);
            // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            // xhr.setRequestHeader('Authorization', 'Basic ' + btoa(clientID + ':' + secretClient));
            // xhr.send(body);
            // xhr.onload = () => {
            //     //handleAuthorizationResponse
            //     if( xhr.status == 200){
            //         let data = JSON.parse(xhr.responseText);
            //         console.log(data);
            //         setIsPending(false);
            //         setError(null);
            //         if(data.access_token != undefined){
            //             //access_token = data.access_token;
            //             //localStorage.setItem("access_token", data.access_token);
            //             setAccess(data.access_token);
            //             console.log("access_token: " + data.access_token);
            //         }
            //         if(data.refresh_token != undefined ){
            //             //refresh_token = data.refresh_token;
            //             //localStorage.setItem("refresh_token", data.refresh_token);
            //             setRefresh(data.refresh_token); 
            //             console.log("refresh_token: " + data.refresh_token);
            //         }
            //     }else{
            //         console.log(xhr.responseText);
            //         alert(xhr.responseText);
            //     }
            // };
            // //window.history.pushState("", "", REDIRECT_URI);
        }
        return () => abortCont.abort();
    }, []);
    return {accessToken, refreshToken, isPending, error};
}

const useSpotifyXHR = (method: string, url: string, body: string | null, ARTokens: any) => {
    const [data, setData] = useState<any>(null);
    const [isPending, setIsPending] = useState<any>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer ' + ARTokens[0])
        xhr.send(body);
        xhr.onload = () => {
            if(xhr.status == 200){
                var data = JSON.parse(xhr.responseText);
                console.log(data);
                setData(data);
                setIsPending(false);
            }else{
                //201 bad or expires token
                //403 bad oauth request
                //429 app has exceeded rate limits
                console.log(xhr.responseText);
                alert(xhr.responseText);
                setError(xhr.responseText)
            }
        };
    }, []);
    return {data, isPending, error};
}

function onPageLoad(setTokensFunc: Function){
    if(window.location.search.length > 0){
        handleRedirect(setTokensFunc);
    }
}

function handleRedirect(setTokensFunc: Function){
    let code = getCode();
    fetchAccessToken(setTokensFunc, code);
    window.history.pushState("", "", REDIRECT_URI);
}

function fetchAccessToken(setTokensFunc: Function, code: string | null){
    let body = 'grant_type=authorization_code';
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(REDIRECT_URI);
    body += "&client_id=" + clientID;
    body += "&client_secret=" + secretClient;
    return callAuthorizationAPI(setTokensFunc, body)
}

function callAuthorizationAPI(body: string){
    let accessToken = null;
    let refreshToken = null;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(clientID + ':' + secretClient));
    xhr.send(body);
    xhr.onload = () => {
        //handleAuthorizationResponse
        if( xhr.status == 200){
            let data = JSON.parse(xhr.responseText);
            console.log(data);
            if(data.access_token != undefined){
                //access_token = data.access_token;
                //localStorage.setItem("access_token", data.access_token);
                access_token = data.access_token;
                console.log("access_token: " + data.access_token);
            }
            if(data.refresh_token != undefined ){
                //refresh_token = data.refresh_token;
                //localStorage.setItem("refresh_token", data.refresh_token);
                refresh_token = data.refresh_token; 
                console.log("refresh_token: " + data.refresh_token);
            }
            //onPageLoad();
        }else{
            console.log(xhr.responseText);
            alert(xhr.responseText);
        }
    }
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


//actual api calls
function getPlaylists(accessToken: string, setPlaylistsFunction: Function){
    callAPI('GET', 'https://api.spotify.com/v1/me/playlists?offset=0&limit=50', null, handlePlaylistResponse, accessToken, setPlaylistsFunction);
}

function mixPlaylists(access_token: string, playlists: Array){
    //create playlists
    //let playlist_id = createPlaylist(access_token);
    //populate playlists
}

function handlePlaylistResponse(xhr: any, setPlaylistsFunction: Function){
    if(xhr.status == 200){
        var data = JSON.parse(xhr.responseText);
        console.log(data);
        setPlaylistsFunction(data.items);
        // data.items.forEach( (item: any) => {
        //     console.log(item.name);
        // });
    }else if(xhr.status == 401){
        //refreshAccessToken();
    }else{
        console.log(xhr.responseText);
        alert(xhr.responseText);
    }
    
}

function callAPI(method: string, url: string, body: string|null, callback: Function, accessToken: string, setPlaylistsFunction: Function){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken)
    xhr.send(body);
    xhr.onload = () => {callback(xhr, setPlaylistsFunction)};
}


export {requestAuthorization, useTokens};
