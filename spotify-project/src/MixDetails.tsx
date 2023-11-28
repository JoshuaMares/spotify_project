import { useLocation } from "react-router-dom";
const MixDetails = (props: any) => {
    const location = useLocation();
    console.log(location);
    // let playlistInfoArray = selectedPlaylists.map((playlist: any) => {
    //     useSpotify(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, 'GET', null);
    // })
    // while(1){
    //     if(playlistInfoArray.filter((playlistObject: any) => {return playlistObject.isFinished}).length == playlistInfoArray.length){
    //         break;
    //     }
    // }
    // playlistInfoArray.forEach((playlistObject: any, index: number) => {
    //     console.log('printing out songs for ' + selectedPlaylists[index].name);
    //     //playlistObject.
    // });
    // //form a url from these

    return ( 
        <div className="MixDetails"></div>
    );
}
 
export default MixDetails;