import './PlaylistDetails.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

const PlaylistDetails = ({playlistInfoProp}) => {
    const [playlistInfo, setPlaylistInfo] = useState(playlistInfoProp);

    function selectPlaylist(){
        console.log(playlistInfo.name, ' clicked');
        if(playlistInfo.selected){
            playlistInfo.selected = false;
        }else{
            playlistInfo.selected = true;
        }
        const newPlaylistInfo = {...playlistInfo};
        setPlaylistInfo(newPlaylistInfo);
    }

    return (
        <div className="PlaylistDetails" onClick={()=>{selectPlaylist()}}>
            <div className="Playlist-Image-Container Full-Height">
                <img src={playlistInfo.images[0].url} alt="{playlist.name}'s image" className="Playlist-Card-Image" />
            </div>
            <div className="Playlist-Text-Container Full-Height">
                <p className='Playlist-Text'> {playlistInfo.name} </p>
                <p className="Playlist-Text Small-Text"> {playlistInfo.owner.display_name} </p>
            </div>
            <div className="Playlist-Checker-Container Full-Height">
                <FontAwesomeIcon icon={faCheck} className={playlistInfo.selected ? "Playlist-Checked" : "Hidden"}/>
            </div>
        </div>
    );
}
 
export default PlaylistDetails;