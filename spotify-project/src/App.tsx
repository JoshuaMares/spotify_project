import './App.css';
import Navbar from "./Navbar.tsx";
import Landing from "./Landing.tsx";
import Playlists from './Playlists.tsx';
import {useState, useEffect } from "react";
import {onPageLoad} from './spotify_functions.tsx';

function App(){
  const [ARTokens, setAccRefTokens] = useState([null, null]);

  useEffect(() => {
    //run and get tokens
    onPageLoad(setAccRefTokens);
  }, []);

  return (<div className="App">
            <Navbar/>
            {!ARTokens[0] && <Landing/>}
            {ARTokens[0] && <Playlists/>}
          </div>);
}

export default App;