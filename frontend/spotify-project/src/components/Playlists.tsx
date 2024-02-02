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
    // const navigate = useNavigate();

    function mixPlaylists(){
        let selectedPlaylists = playlistObject.playlists.filter((playlist: any) => playlist.selected)
                            .map((playlist: any) => {
                                return {
                                    'name': playlist.name,
                                    'id': playlist.id
                                }
                            });
        console.log('playlists to mix:' + JSON.stringify(selectedPlaylists));
    //     navigate('/mixers', {'state': {'userID': userInfoObject.data.id, 'playlists': selectedPlaylists}});
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
        // playlistObject.setPlaylists((prevState: any) => ({
        //     ...prevState,
        //     'items': updatedPlaylists
        // }));
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
                    ? <PlaylistDetails playlistInfoProp={playlist} key={playlist.id}/> 
                    : <div className="Hidden"></div>
                // <div className={playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ? "Playlist-Card" : "Hidden"} key={playlist.id} onClick={() => {selectPlaylist(index)}}>
                //     <div className="Playlist-Card-Image-Container Full-Height">
                //         <img src={playlist.images[0].url} alt="{playlist.name}'s image" className="Playlist-Card-Image" />
                //     </div>
                //     <div className="Playlist-Text Full-Height">
                //         <p className='Playlist-Name'> {playlist.name} </p>
                //     </div>
                //     <div className="Playlist-Checker-Container Full-Height">
                //         <FontAwesomeIcon icon={faCheck} className={playlist.selected ? "Playlist-Checked" : "Hidden"}/>
                //     </div>
                // </div>
            )))}
        </div>
    );
}
 
export default Playlists;