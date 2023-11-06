import './App.css';
import Navbar from "./Navbar.tsx";
import Intro from "./Intro.tsx";
import {useState, useEffect } from "react";
import {clientID, secretClient} from "../../spotify_keys.ts"

function App(){
  return (<div className="App">
            <Navbar/>
            <Intro/>
          </div>);
}

export default App;