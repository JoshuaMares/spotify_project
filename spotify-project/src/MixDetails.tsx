import './MixDetails.css';
import {useState} from "react"
import { useLocation } from "react-router-dom";
import { useSpotify } from "./spotify_functions";

const MixDetails = (props: any) => {
    const [mixName, setName] = useState('My Mix');
    const [mixDesc, setDesc] = useState('Sickest Mix since pb & j');
    //const [mixImage, setImage] = useState(null);

    const location = useLocation();
    console.log(location.state);
    let playlistTracksObjects = location.state.map((playlist: any) => {
        return useSpotify(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, 'GET', null);
    })
    //console.log('playlist tracks objects: ' + JSON.stringify(playlistTracksObjects));

    function countUnfinished(){
        return playlistTracksObjects.map((playlistTracksObject: any) => playlistTracksObject.isFinished ? 0 : 1)
            .reduce((accumulator: number, currentVal: any) => accumulator + currentVal, 0)
    }

    function createMix(event: Event){
        event.preventDefault();
        //combine playlists here
    }

    // function fileSelectHandler(event: any){
    //     console.log(event.target.files[0]);
    //     setImage(event.target.files[0]);
    // }

    return ( 
        <div className="MixDetails">
            <form className="Mix-Info" onSubmit={createMix}>
                <div className="Info-Container">
                    {/* <div className="Mix-Image-Container">
                        {mixImage && <img className="Mix-Image" src={URL.createObjectURL(mixImage)} alt="chosen mix image"/>}
                        <input type="file" onChange={fileSelectHandler} accept="image/*"/>
                    </div> */}
                    <div className="Text-Container">
                        <input type="text" className="Mix-Name" value={mixName} onChange={(e) => setName(e.target.value)} placeholder="Name" autoComplete="off" required/>
                        <input type="text" className="Mix-Desc" value={mixDesc} onChange={(e) => setDesc(e.target.value)} placeholder="Desc" autoComplete="off" required/>
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
                <div className="Mix-Button-Container">
                    {countUnfinished() 
                        ? <button className="Wait-Button" onClick={(event) => {event.preventDefault()}}>Loading Music...</button> 
                        : <button className="Mix-Button">Mix</button> 
                    }
                </div>
            </form>
        </div>
    );
}
 
export default MixDetails;