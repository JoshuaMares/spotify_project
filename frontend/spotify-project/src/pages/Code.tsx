import "./Code.css"
import { useSpotifyLogin } from "../hooks/useSpotifyLogin";

const Code = () => {
    const {login, error, isLoading} = useSpotifyLogin();

    return ( 
        <div className="Code">
            <div className="textBox">
                <h1>Authorization Code</h1>
                <p>
                Great! Finish logging in below.
                </p> 
            </div>
            <button className="loginButton" onClick={login}>Get Started!</button>
        </div>
    );
}
 
export default Code;