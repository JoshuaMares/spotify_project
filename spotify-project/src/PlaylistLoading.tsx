import { useLocation, useNavigate} from "react-router-dom";
import { useSpotify } from "./spotify_functions";
import { useEffect } from "react";

const PlaylistLoadingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location.state);

    useEffect(() => {
        if(location.state == null){
            console.log('attempting to navigate to playlistloading without providing data, going home');
            window.location.href = 'http://localhost:5173/';
        }
    }, []);

    const songURIList = location.state.songList.map((songObject: any) => {
        return songObject.uri
    });
    var songURILoads = [];
    var size = 100; 
    for (var i=0; i < songURIList.length; i+=size) {
        songURILoads.push(songURIList.slice(i,i+size));
    }
    const songLoadObjects = songURILoads.map((songLoad: any) => {
        return useSpotify(`https://api.spotify.com/v1/playlists/${location.state.playlistID}/tracks`, 'POST', JSON.stringify({'uris': songLoad}));
    })

    function countUnfinished(){
        return songLoadObjects.map((songLoadObject: any) => songLoadObject.isFinished ? 0 : 1)
            .reduce((accumulator: number, currentVal: any) => accumulator + currentVal, 0)
    }

    return (  
        <div className="Playlist-Loading-Page">
            { countUnfinished() ? <h1 style={{'color': 'white', 'height': '100%'}}> Filling {location.state.playlistName}... </h1> 
                                : <h1 style={{'color': 'white', 'height': '100%'}}> Done </h1>}
        </div>
    );
}
 
export default PlaylistLoadingPage;