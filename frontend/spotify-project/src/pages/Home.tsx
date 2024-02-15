import './Home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faSwatchbook } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import Loading from './Loading';
import Error from './Error';
import Mixers from './Mixers';
import Playlists from '../components/Playlists';

const Home = () => {
    //pull user info here
    const [window, setWindow] = useState('mixers');
    return (
        <div className="Home">
            {window == 'mixers' && <Mixers/>}
            {window == 'library' && <Playlists/>}

            <div className="Buttons-Container">
                <div className="Buttons Mixers" onClick={() => setWindow('mixers')}>
                    <FontAwesomeIcon icon={faEnvelope} className='Buttons-Icon'/>
                    <p>Mixers</p>
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