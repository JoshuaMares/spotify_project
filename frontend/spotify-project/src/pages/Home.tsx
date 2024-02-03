import './Home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faSwatchbook } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import Loading from './Loading';
import Error from './Error';
import Invites from './Invites';
import Playlists from '../components/Playlists';

const Home = () => {
    const [window, setWindow] = useState('invites');
    return (
        <div className="Home">
            {window == 'invites' && <Invites/>}
            {window == 'library' && <Playlists/>}

            <div className="Buttons-Container">
                <div className="Buttons Invites" onClick={() => setWindow('invites')}>
                    <FontAwesomeIcon icon={faEnvelope} className='Buttons-Icon'/>
                    <p>Invites</p>
                </div>
                <div className="Buttons Library" onClick={() => setWindow('library')}>
                    <FontAwesomeIcon icon={faSwatchbook} className='Buttons-Icon'/>
                    <p>Library</p>
                </div>
            </div>
        </div>
    )
}
 
export default Home;