import "./Landing.css"
import { connect } from '../hooks/useSpotifyLogin';

const Landing = () => {

    return (  
        <div className="Landing">
            <div className="textBox">
                <h1>Welcome to Mixers!</h1>
                <p>
                Jam out with your friends by Mixing your favorite 
                playlists into a new exciting Mixer! Connect your
                Spotify account below to get started start!
                </p> 
            </div>
            <button className="connectButton" onClick={connect}>Connect</button>
        </div>
    );
}
 
export default Landing;