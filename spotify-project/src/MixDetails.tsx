import { useLocation } from "react-router-dom";
import { useSpotify } from "./spotify_functions";

const MixDetails = (props: any) => {
    const location = useLocation();
    console.log(location.state);
    let playlistTracksObjects = location.state.map((playlist: any) => {
        return useSpotify(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, 'GET', null);
    })
    console.log('playlist tracks objects: ' + JSON.stringify(playlistTracksObjects));
    // while(1){
    //     console.log('still checkin');
    //     if(playlistTracksObjects.filter((tracksObject: any) => {return tracksObject.isFinished}).length == playlistTracksObjects.length){
    //         console.log('no longer checkin');
    //         break;
    //     }
    // }
     playlistTracksObjects.forEach((tracksObject: any, index: number) => {
        console.log('printing out songs for ' + location.state[index].name);
        console.log(tracksObject.data.items);
    });
    //loop through in return instead
    //form a url from these

    return ( 
        <div className="MixDetails">
            
        </div>
    );
}
 
export default MixDetails;