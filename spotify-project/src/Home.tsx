import './Home.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPlus, faSwatchbook, faShuffle, faArrowsSpin} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import { useTokens } from './spotify_functions';
import Loading from './Loading';
import Error from './Error';
import Invites from './Invites';


const Home = () => {
    const {accessToken, refreshToken, isPending: tokensPending, error: tokensError} = useTokens();
    const [window, setWindow] = useState('invites');

    return (  
        <div className="Home">
            <div className="Library-Info">
                <p className="Banner">My Playlists</p>
                <FontAwesomeIcon icon={faArrowsSpin} className='ASDF'/>
            </div>

            {tokensError && <Error error={tokensError}/>}
            {tokensPending && <Loading/>}
            {accessToken && window == 'invites' && <Invites/>}

            <div className="Buttons-Container">
                <div className="Buttons Invites" onClick={() => setWindow('invites')}>
                    <FontAwesomeIcon icon={faEnvelope}/>
                    <p>Invites</p>
                </div>
                <div className="Buttons Library" onClick={() => setWindow('library')}>
                    <FontAwesomeIcon icon={faSwatchbook}/>
                    <p>Library</p>
                </div>
            </div>
        </div>
    );
}
 
export default Home;