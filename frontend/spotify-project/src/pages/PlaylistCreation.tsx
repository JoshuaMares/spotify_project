import { useLocation, useNavigate} from "react-router-dom";
import { useSpotify } from "../hooks/useSpotifyLogin";
import { useEffect } from "react";
import Error from "./Error";

const PlaylistCreationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location.state);

    useEffect(() => {
        if(location.state == null){
            console.log('attempting to navigate to playlistcreation without providing data, going home');
            window.location.href = 'http://localhost:5173/';
        }
    }, []);

    const playlistCreationObject = useSpotify(`https://api.spotify.com/v1/users/${location.state.userID}/playlists`, 'POST', 
                                        JSON.stringify({
                                            'name': location.state.playlistName,
                                            'description': location.state.playlistDesc,
                                            'public': false,
                                            'collaborative': true
                                        })
    );
    
    function fillPlaylist(){
        console.log(JSON.stringify(playlistCreationObject.data));
        navigate('/filling_playlist', {'state': {...location.state, 'playlistID': playlistCreationObject.data.id}});
    }

    return (  
        <div className="Playlist-Creation-Page">
            {playlistCreationObject.error && <Error error={playlistCreationObject.error}/>}
            {playlistCreationObject.isPending && <h1 style={{'color': 'white', 'height': '100%'}}> Creating {location.state.playlistName}... </h1>}
            {playlistCreationObject.data && fillPlaylist()}
        </div>
    );
}
 
export default PlaylistCreationPage;