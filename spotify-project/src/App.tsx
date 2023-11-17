import './App.css';
import Navbar from "./Navbar.tsx";
import Landing from "./Landing.tsx";
import Home from "./Home.tsx"
import {useTokens, onPageLoad, getPlaylists} from './spotify_functions.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/*
if we have keys stored, go straight to home page
if no keys present landing page with button to get keys
on callback
*/

function App(){
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <div className="content">
          <Routes>
            <Route path="/" element={<Landing/>} />
            <Route path="/home/" element={<Home/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;