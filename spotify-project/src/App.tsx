import './App.css';
import Navbar from "./Navbar.tsx";
import Landing from "./Landing.tsx";
import {useState, useEffect } from "react";
import {clientID, secretClient} from "../../spotify_keys.ts"
import {onPageLoad, access_token, refresh_token} from './spotify_functions.tsx';

function App(){
  useEffect(onPageLoad, []);

  return (<div className="App">
            <Navbar/>
            <Landing/>
          </div>);
}

export default App;