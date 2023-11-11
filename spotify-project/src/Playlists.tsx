import './Playlists.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import {useState, useEffect} from "react";

const Playlists = ({accessToken, getPlaylistsFunc}) => {
    const [playlists, setPlaylists] = useState([]);
    
    useEffect(() => {
        getPlaylistsFunc(accessToken, setPlaylists);
    }, []);

    return (
        <div className="Playlists">
            {playlists.map((playlist) => (
                <div className="Playlist-Card" key={playlist.id}>
                    <img src={playlist.images[0].url} alt="{playlist.name}'s image" className="Playlist-Image" />
                    <p className='Playlist-Text'> {playlist.name} </p>
                    <FontAwesomeIcon icon={faCheck} className="Playlist-Checker"/>
                </div>
            ))}
            <button className="Mix">Mix</button>
        </div>
    );
}
 
export default Playlists;