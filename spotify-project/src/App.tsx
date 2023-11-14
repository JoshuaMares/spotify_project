import './App.css';
import Navbar from "./Navbar.tsx";
import Landing from "./Landing.tsx";
import Mix from './Mix.tsx';
import {useState, useEffect } from "react";
import {onPageLoad, getPlaylists} from './spotify_functions.tsx';

function App(){
  const [landingPage, setLandingPage] = useState(true);
  const [playlistsPage, setPlaylistsPage] = useState()
  const [playlistSettingsPage, setNewPlatlistPage] = useState()

  const [ARTokens, setAccRefTokens] = useState([null, null]);

  useEffect(() => {
    //get tokens
    onPageLoad(setAccRefTokens);
  }, []);

  return (<div className="App">
            <Navbar/>
            {!ARTokens[0] && <Landing/>}
            {ARTokens[0] && <Mix accessToken={ARTokens[0]} getPlaylistsFunc={getPlaylists}/>}
          </div>);
}

export default App;