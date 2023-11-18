import './App.css';
import { useEffect } from "react";
import Navbar from "./Navbar.tsx";
import Landing from "./Landing.tsx";
import Home from "./Home.tsx"
import { onPageLoad } from './spotify_functions.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App(){

  useEffect(() => {
    onPageLoad();
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar/>
        <div className="Content">
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