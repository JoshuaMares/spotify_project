import './PlaylistDetails.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

const PlaylistDetails = ({playlistInfoProp, indexProp, onClickProp}) => {
    //console.log(playlistInfoProp);

    return (
        <div className="PlaylistDetails" onClick={()=>{onClickProp(indexProp)}}>
            <div className="Playlist-Image-Container Full-Height">
                <img src={playlistInfoProp.images[0]?.url} alt="image" className="Playlist-Card-Image" />
            </div>
            <div className="Playlist-Text-Container Full-Height">
                <p className='Playlist-Text'> {playlistInfoProp.name} </p>
                <p className="Playlist-Text Small-Text"> {playlistInfoProp.owner.display_name} </p>
            </div>
            <div className="Playlist-Checker-Container Full-Height">
                <FontAwesomeIcon icon={faCheck} className={playlistInfoProp.selected ? "Playlist-Checked" : "Hidden"}/>
            </div>
        </div>
    );
}
 
export default PlaylistDetails;