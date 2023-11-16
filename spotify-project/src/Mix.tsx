import "./Mix.css"
import Playlists from "./Playlists";
import {useState, useEffect } from "react";
import {makeMix} from './spotify_functions.tsx';

const Mix = ({accessToken, getPlaylistsFunc}) => {
    const [mixName, setName] = useState('My Mix');
    const [mixDesc, setDesc] = useState('Sickest Mix since pb & j');
    const [mixImage, setImage] = useState('');
    const [playlists, setPlaylists] = useState([]);

    const createMix = (e: Event) => {
        e.preventDefault();
        const playlistInfo = {mixName, mixDesc, mixImage};
        //makeMix(playlistInfo, )

    }

    return (  
        <div className="Mix">
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
                <Playlists accessToken={accessToken} getPlaylistsFunc={getPlaylistsFunc}/>
                <div className="Mix-Button-Container">
                    <button className="Mix-Button">Mix</button>
                </div>
            </form>
        </div>
    );
}
 
export default Mix;