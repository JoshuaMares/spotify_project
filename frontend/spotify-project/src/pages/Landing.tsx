import "./Landing.css"
import { useSpotifyLogin } from '../hooks/useSpotifyLogin';

const Landing = () => {
    const { login, isLoading, error } = useSpotifyLogin();

    return (  
        <div className="Landing">
            <div className="textBox">
                <h1>Welcome to Mixers!</h1>
                <p>
                Jam out with your friends by Mixing your favorite 
                playlists into a new exciting Mixer! Login below to 
                start!
                </p> 
            </div>
            <button className="loginButton" onClick={login}>Log In</button>
        </div>
    );
}
 
export default Landing;