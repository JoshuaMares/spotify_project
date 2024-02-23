import './MixerDetails.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faLink } from '@fortawesome/free-solid-svg-icons'

const MixerDetails = ({mixerProp}) => {
    return (
        <div className="MixerDetails">
            <div className="Mixer-Image-Container Full-Height">
                <img src={mixerProp.playlistImage} alt="image" className="Mixer-Card-Image" />
            </div>
            <div className="Mixer-Text-Container Full-Height">
                <a className='Playlist-Link' href={mixerProp.playlistLink}>
                    <p className='Mixer-Text'> {mixerProp.name} </p>
                    <FontAwesomeIcon icon={faLink}/>
                </a>
                <p className="Mixer-Text Small-Text"> {mixerProp.displayNames.join(', ')} </p>
            </div>
            <div className="Mixer-Edit-Container Full-Height">
                <FontAwesomeIcon icon={faPen} className={"Edit-Button"}/>
            </div>
        </div>
    );
}
 
export default MixerDetails;