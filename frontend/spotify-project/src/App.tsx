import './App.css';
import Navbar from "./components/Navbar.tsx";
import Landing from "./pages/Landing.tsx";
import Code from "./pages/Code.tsx"
import Home from "./pages/Home.tsx"
import PlaylistCreationPage from './pages/PlaylistCreation.tsx';
import { useSpotifyLogin } from './hooks/useSpotifyLogin.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MixDetails from './pages/MixDetails.tsx';
import PlaylistLoadingPage from './pages/PlaylistLoading.tsx';

function App(){
  useSpotifyLogin();
  
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <div className="Content">
          <Routes>
            <Route path="/" element={<Landing/>} />
            <Route path="/code" element={<Code/>} />
            <Route path="/home/" element={<Home/>}/>
            {/* <Route path="/mixers/" element={<MixDetails/>}/>
            <Route path="/creating_playlist/" element={<PlaylistCreationPage/>}/>
            <Route path="/filling_playlist/" element={<PlaylistLoadingPage/>}/> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;