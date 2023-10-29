import Message from "./Message";
import './App.css';
import {useState, useEffect } from "react";
import {clientID, secretClient} from "../../spotify_keys.ts"

function App(){
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + clientID + '&client_secret=' + secretClient
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token));
  }, [] );

  return <div><Message /></div>;
}

export default App;