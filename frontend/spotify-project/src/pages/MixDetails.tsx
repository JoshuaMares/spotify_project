import './MixDetails.css';
import { useState, useEffect} from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useMixers } from "../hooks/useMixers"
import PlaylistDetails from '../components/PlaylistDetails';

const MixDetails = (props: any) => {
    const [mixName, setName] = useState('My Mix');
    const [mixDesc, setDesc] = useState('Sickest Mix since pb & j');
    const [contributors, setContributors] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { createMixer, mixerObject, isLoading, error } = useMixers();
    console.log('location state: ', location.state);

    useEffect(() => {
        if(location.state == null){
            console.log('attempting to navigate to mixdetails without providing data, going home');
            window.location.href = 'http://localhost:5173/';
        }
    }, []);

    let playlists = location.state.playlists;

    async function createMix(event: Event){
        event.preventDefault();
        console.log('clicking create mix button');
        let contributorsArray = contributors.split(' ').filter((c) => c.length);
        let constituentPlaylists = playlists.map((playlist:any) => {return playlist.id});
        await createMixer(mixName, mixDesc, contributorsArray, constituentPlaylists);
        if(error){
            alert(error);
        }else{
            console.log('mixerobject: ', mixerObject);
        }
        return;
    }

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
                {playlists.map((playlist: any) => {
                    {console.log(playlist)}
                    return <PlaylistDetails playlistInfoProp={playlist} indexProp={null} onClickProp={() => {}} key={playlist.id}/>
                })}
                {/* {playlistTracksObjects.map((ptObject: any, index: number) =>{
                    if(!ptObject.isPending){
                        return (
                            <div className="PlaylistCard">
                                <div className="PlaylistName"><p style={{'color': 'white'}}>{location.state.playlists[index].name}</p></div>
                                <div className="PlaylistSongs">
                                    {ptObject.data.items.map((songInfo: any) => {
                                        return (<p style={{'color': 'white'}}>{songInfo.track.name}</p>);
                                    })}
                                </div>
                            </div>
                        )
                    }
                })} */}
                <div className="Mix-Button-Container">
                    <button className="Mix-Button">Mix</button> 
                    {/* {countUnfinished() 
                        ? <button className="Wait-Button" onClick={(event) => {event.preventDefault()}}>Loading Music...</button> 
                        : <button className="Mix-Button">Mix</button> 
                    } */}
                </div>
            </form>
        </div>
    );
}
 
export default MixDetails;