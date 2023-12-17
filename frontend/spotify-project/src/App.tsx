import './App.css';
import Navbar from "./Navbar.tsx";
import Landing from "./Landing.tsx";
import Home from "./Home.tsx"
import Loading from './Loading.tsx';
import PlaylistCreationPage from './PlaylistCreation.tsx';
import { useTokens } from './spotify_functions.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MixDetails from './MixDetails.tsx';
import PlaylistLoadingPage from './PlaylistLoading.tsx';

function App(){
  useTokens();
  
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <div className="Content">
          <Routes>
            <Route path="/" element={<Landing/>} />
            <Route path="/loading/" element={<Loading/>} />
            <Route path="/home/" element={<Home/>}/>
            <Route path="/mixers/" element={<MixDetails/>}/>
            <Route path="/creating_playlist/" element={<PlaylistCreationPage/>}/>
            <Route path="/filling_playlist/" element={<PlaylistLoadingPage/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;