import { useEffect, useState } from "react";
import { useAuthContext } from "./useAuthContext";

const usePlaylists = (userID: string) => {
    const { user } = useAuthContext();
    const [playlists, setPlaylists] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    let playlistsObject = {playlists, setPlaylists, isLoading, setIsLoading, error, setError};

    useEffect(() => {
        const abortCont = new AbortController();
        let fetchParameters = {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': ('Bearer ' + user.jwt)
            },
            'body': null,
            'signal': abortCont.signal
        };

        const fetchPlaylists = async () => {
            console.log('FETCHING PLAYLISTS');

            const response = await fetch(`http://localhost:4000/user/${userID}/playlists`, fetchParameters);
            const json = await response.json();

            if(!response.ok){
                console.log('ERROR GETTING PLAYLISTS');
                setIsLoading(false);
                setError(json.error);
            }{
                console.log('json: ', json);
                setPlaylists(json.playlists);
                setIsLoading(false);
            }
        }

        if(!user){
            setError('You must be logged in first');
        }else{
            fetchPlaylists();
        }
        return () => abortCont.abort();
    }, []);

    return playlistsObject;
}

export {usePlaylists};