import './MixDetails.css';
import { useState, useEffect} from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useMixers } from "../hooks/useMixers"
import PlaylistDetails from '../components/PlaylistDetails';

const MixDetails = (props: any) => {
    const [mixName, setName] = useState('');
    const [mixDesc, setDesc] = useState('');
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
            <form className="Mix-Info" onSubmit={async (event) => {await createMix(event)}}>
                <div className="Info-Container">
                    {/* <div className="Mix-Image-Container">
                        {mixImage && <img className="Mix-Image" src={URL.createObjectURL(mixImage)} alt="chosen mix image"/>}
                        <input type="file" onChange={fileSelectHandler} accept="image/*"/>
                    </div> */}
                    <div className="Text-Container">
                        <div className="Mix-Input">
                            <p className="Input-Prompt">Name:</p>
                            <input type="text" className="Mix-Name" value={mixName} onChange={(e) => setName(e.target.value)} placeholder="My Mix" autoComplete="off" required/>
                        </div>
                        <div className="Mix-Input">
                            <p className="Input-Prompt">Desc:</p>
                            <input type="text" className="Mix-Desc" value={mixDesc} onChange={(e) => setDesc(e.target.value)} placeholder="Sickest Mix Since PB&J" autoComplete="off"/>
                        </div>
                        <div className="Mix-Input">
                            <p className="Input-Prompt">Friends:</p>
                            <input type="text" className="Mix-Contributors" value={contributors} onChange={(e) => setContributors(e.target.value)} placeholder="username1 username2 ..." autoComplete="off"/>
                        </div>
                    </div>
                </div>
                {playlists.map((playlist: any) => {
                    return <PlaylistDetails playlistInfoProp={playlist} indexProp={null} onClickProp={() => {}} key={playlist.id}/>
                })}
                <div className="Mix-Button-Container">
                    <button className="Mix-Button">Mix</button> 
                </div>
            </form>
        </div>
    );
}
 
export default MixDetails;