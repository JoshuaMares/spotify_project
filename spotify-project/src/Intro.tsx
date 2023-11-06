import "./Intro.css"
import {requestAuthorization} from './spotify_functions';

const Intro = () => {
    return (  
        <div className="Intro">
            <div className="textBox">
                <h1>Welcome to Mixers!</h1>
                <p>
                Jam out with your friends by Mixing your favorite 
                playlists into a new exciting Mixer! Login below to 
                start!
                </p> 
            </div>
            <button className="loginButton" onClick={requestAuthorization}>Log In</button>
        </div>
    );
}
 
export default Intro;