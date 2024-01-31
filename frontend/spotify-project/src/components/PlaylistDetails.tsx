import './PlaylistDetails.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck} from '@fortawesome/free-solid-svg-icons'

const PlaylistDetails = ({playlistInfo}) => {
    return (
        <div className="PlaylistDetails" onClick={()=>{}}>
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