import './App.css';
import Navbar from "./Navbar.tsx";
import Landing from "./Landing.tsx";
import Mix from './Mix.tsx';
import {useState, useEffect } from "react";
import {onPageLoad, getPlaylists} from './spotify_functions.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App(){
  useEffect(() => {
    //onPageLoad();
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar/>
        <div className="content">
          <Routes>
            <Route path="/" element={<Landing/>} />
            <Route path="/home" element={<Mix />}/>
            <Route path="/playlist/:id" />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

/*
{!ARTokens[0] && <Landing/>}
{ARTokens[0] && <Mix accessToken={ARTokens[0]} getPlaylistsFunc={getPlaylists}/>} 
*/