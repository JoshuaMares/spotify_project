import './Playlists.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import {useState, useEffect} from "react";

const Playlists = ({accessToken, getPlaylistsFunc}) => {
    const [playlists, setPlaylists] = useState([]);
    const [searchQuery, setSearch] = useState('');
    
    useEffect(() => {
        getPlaylistsFunc(accessToken, setPlaylists);
    }, []);

    function selectPlaylist(index: number){
        //useState uses references to decide if dom should re-render so have to copy arrays
        if(playlists[index].selected){
            playlists[index].selected = false;
        }else{
            playlists[index].selected = true;
        }
        const updatedPlaylists = [...playlists];
        setPlaylists(updatedPlaylists);
    }

    return (
        <div className="Playlists">
            <input className="Search-Bar" type="text" placeholder="Search..." autoComplete="off" onKeyUp={(e) => setSearch(e.target.value)}/>
            {playlists.map((playlist, index) => (
                <div className={playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ? "Playlist-Card" : "Hidden"} key={playlist.id} onClick={() => {selectPlaylist(index)}}>
                    <div className="Playlist-Card-Image-Container Full-Height">
                        <img src={playlist.images[0].url} alt="{playlist.name}'s image" className="Playlist-Card-Image" />
                    </div>
                    <div className="Playlist-Text Full-Height">
                        <p className='Playlist-Name'> {playlist.name} </p>
                    </div>
                    <div className="Playlist-Checker-Container Full-Height">
                        <FontAwesomeIcon icon={faCheck} className={playlist.selected ? "Playlist-Checked" : "Hidden"}/>
                    </div>
                </div>
            ))}
        </div>
    );
}
 
export default Playlists;