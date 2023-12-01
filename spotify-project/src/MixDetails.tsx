import {useState} from "react"
import { useLocation } from "react-router-dom";
import { useSpotify } from "./spotify_functions";

const MixDetails = (props: any) => {
    const [mixName, setName] = useState('My Mix');
    const [mixDesc, setDesc] = useState('Sickest Mix since pb & j');
    const [mixImage, setImage] = useState('');

    const location = useLocation();
    console.log(location.state);
    let playlistTracksObjects = location.state.map((playlist: any) => {
        return useSpotify(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, 'GET', null);
    })
    //console.log('playlist tracks objects: ' + JSON.stringify(playlistTracksObjects));

    return ( 
        <div className="MixDetails">
            <form className="Mix-Info" onSubmit={createMix}>
                <div className="Info-Container">
                    <div className="Mix-Image-Container">
                        {mixImage && <img src="mixImage" alt="chosen mix image"/>}
                        <input type="file" className="Mix-Image" value={mixImage} onChange={(e) => {console.log(e.target.value);setImage(e.target.value)}} accept="image/*"/>
                    </div>
                    <div className="Text-Container">
                        <input type="text" className="Mix-Name" value={mixName} onChange={(e) => setName(e.target.value)} placeholder="Name" autoComplete="off" required/>
                        <input type="text" className="Mix-Desc" value={mixDesc} onChange={(e) => setDesc(e.target.value)}placeholder="Desc" autoComplete="off" required/>
                    </div>
                </div>
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
            </form>
        </div>
    );
}
 
export default MixDetails;