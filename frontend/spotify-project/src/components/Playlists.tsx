import './Playlists.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faArrowsSpin} from '@fortawesome/free-solid-svg-icons'
import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Loading from '../pages/Loading';
import Error from '../pages/Error';
import { usePlaylists } from '../hooks/usePlaylists';
import PlaylistDetails from "../components/PlaylistDetails";
import { useAuthContext } from '../hooks/useAuthContext';
import { useUserProfile } from '../hooks/useUserProfile';

const Playlists = () => {
    const navigate = useNavigate();

    function mixPlaylists(){
        let selectedPlaylists = playlistObject.playlists.filter((playlist: any) => playlist.selected)
                            .map((playlist: any) => {
                                return {
                                    ...playlist,
                                    'selected': false,
                                }
                            });
        console.log('playlists to mix:' + JSON.stringify(selectedPlaylists));

        if(selectedPlaylists.length < 2){
            alert('Need at least two playlists to create a mix!');
            return;
        }
        navigate('/mixers', {'state': {'playlists': selectedPlaylists}});
        return;
    }

    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuthContext();

    if(!user){
        window.location.href = 'http://localhost:5173/';
    }
    const playlistObject = usePlaylists(user.userID);
    const userProfileObject = useUserProfile(user.userID);

    function profileImageExists(){
        return userProfileObject.userProfile.images.length ? true : false;
    }

    function selectPlaylist(index: number){
        console.log('clicking playlist', playlistObject.playlists[index].name);
        let playlists = playlistObject.playlists;
        //useState uses references to decide if dom should re-render so have to copy arrays
        if(playlists[index].selected){
            playlists[index].selected = false;
        }else{
            playlists[index].selected = true;
        }
        const updatedPlaylists = [...playlists];
        playlistObject.setPlaylists(updatedPlaylists);
    }

    return (
        <div className="Playlists">
            {!userProfileObject.isLoading &&
                <div className="Library-Info">
                    {profileImageExists()  && 
                        <div className="User-Image-Container">
                            <img src={userProfileObject.userProfile.images[0].url} alt='User Image' className='User-Image' />
                        </div>
                    }
                    <div className="Banner-Container">
                        <p className="Banner">{userProfileObject.userProfile.display_name}'s playlists</p>
                    </div>
                    <div className="Mix-Page-Button-Container">
                        <FontAwesomeIcon icon={faArrowsSpin} className='Mix-Page-Button' onClick={mixPlaylists}/>
                    </div>
                </div>
            }

            <input className="Search-Bar" type="text" placeholder="Search..." autoComplete="off" onKeyUp={(e) => setSearchQuery(e.target.value)}/>
            {playlistObject.error && <Error error={playlistObject.error}/>}
            {playlistObject.isLoading && <Loading/>}
            {!playlistObject.isLoading && (
                playlistObject.playlists.map((playlist: any, index: number) => (
                    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
                        ? <PlaylistDetails playlistInfoProp={playlist} indexProp={index} onClickProp={selectPlaylist} key={playlist.id}/> //passing in onclick function should work
                        : <div className="Hidden"></div>
                ))
            )}
        </div>
    );
}
 
export default Playlists;