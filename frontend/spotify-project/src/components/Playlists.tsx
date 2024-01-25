import './Playlists.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faArrowsSpin} from '@fortawesome/free-solid-svg-icons'
import {useState, useEffect} from "react";
import { useSpotify } from '../hooks/useSpotifyLogin';
import { useNavigate } from "react-router-dom";

const Playlists = ({userInfoObject, playlistObject}) => {
    //const [playlists, setPlaylists] = useState([]);
    const [searchQuery, setSearch] = useState('');
    const navigate = useNavigate();

    function selectPlaylist(index: number){
        let playlists = playlistObject.data.items;
        //useState uses references to decide if dom should re-render so have to copy arrays
        if(playlists[index].selected){
            playlists[index].selected = false;
        }else{
            playlists[index].selected = true;
        }
        const updatedPlaylists = [...playlists];
        playlistObject.setData((prevState: any) => ({
            ...prevState,
            'items': updatedPlaylists
        }));
    }

    function mixPlaylists(){
        let selectedPlaylists = playlistObject.data.items.filter((playlist: any) => playlist.selected)
                            .map((playlist: any) => {
                                return {
                                    'name': playlist.name,
                                    'id': playlist.id
                                }
                            });
        console.log('playlists to mix:' + JSON.stringify(selectedPlaylists));
        navigate('/mixers', {'state': {'userID': userInfoObject.data.id, 'playlists': selectedPlaylists}});
    }

    return (
        <div className="Playlists">
            <div className="Library-Info">
                {userInfoObject.data.images.url && 
                    <div className="User-Image-Container">
                        <img src={userInfoObject.data.images.url} alt='User Image' className='User-Image' />
                    </div>
                }
                <div className="Banner-Container">
                    <p className="Banner">{userInfoObject.data.display_name}'s playlists</p>
                </div>
                <div className="Mix-Page-Button-Container">
                    <FontAwesomeIcon icon={faArrowsSpin} className='Mix-Page-Button' onClick={mixPlaylists}/>
                </div>
            </div>

            <input className="Search-Bar" type="text" placeholder="Search..." autoComplete="off" onKeyUp={(e) => setSearch(e.target.value)}/>
            {playlistObject.data.items.map((playlist: any, index: number) => (
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