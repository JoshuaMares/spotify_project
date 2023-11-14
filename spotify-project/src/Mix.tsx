import "./Mix.css"
import Playlists from "./Playlists";

const Mix = ({accessToken, getPlaylistsFunc}) => {
    return (  
        <div className="Mix">
            <form className="Mix-Info">
                <div className="Info-Container">
                    <div className="Mix-Image-Container">
                        <input type="file" className="Mix-Image" accept="image/*"/>
                    </div>
                    <div className="Text-Container">
                        <input type="text" className="Mix-Name" placeholder="Name..." autoComplete="off" required/>
                        <input type="text" className="Mix-Desc" placeholder="Desc..." autoComplete="off" required/>
                    </div>
                </div>
                <Playlists accessToken={accessToken} getPlaylistsFunc={getPlaylistsFunc}/>
                <div className="Mix-Button-Container">
                    <button className="Mix-Button">Mix</button>
                </div>
            </form>
        </div>
    );
}
 
export default Mix;