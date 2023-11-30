import { useLocation } from "react-router-dom";
import { useSpotify } from "./spotify_functions";

const MixDetails = (props: any) => {
    const location = useLocation();
    console.log(location.state);
    let playlistTracksObjects = location.state.map((playlist: any) => {
        return useSpotify(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, 'GET', null);
    })
    //console.log('playlist tracks objects: ' + JSON.stringify(playlistTracksObjects));

    return ( 
        <div className="MixDetails">
            {playlistTracksObjects.map((ptObject: any, index: number) =>{
                if(!ptObject.isPending){
                    return (
                        <div className="PlaylistCard">
                            <div className="PlaylistName"><p style={{'color': 'white'}}>{location.state[index].name}</p></div>
                            <div className="PlaylistSongs">
                                {ptObject.data.items.map((songInfo: any) => {
                                    return (<p style={{'color': 'white'}}>{songInfo.track.name}</p>);
                                })}
                            </div>
                        </div>
                    )
                }
            })}
        </div>
    );
}
 
export default MixDetails;