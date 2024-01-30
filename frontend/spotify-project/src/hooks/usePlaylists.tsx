import { useEffect, useState } from "react";

const usePlaylists = () => {
    const [playlists, setPlaylists] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    let spotifyObject = {playlists, setPlaylists, isLoading, setIsLoading, error, setError};

    useEffect(() => {
        const fetchPlaylists = async () => {
            const abortCont = new AbortController();
            let fetchParameters = {
                'method': 'GET',
                'headers': {
                    'Content-Type': 'application/json',
                    //'Authorization': ('Bearer ' + accessToken)
                },
                'body': '',
                'signal': abortCont.signal
            };

            const response = await fetch('http://localhost:4000/playlists', fetchParameters);
            const json = await response.json();

            if(!response.ok){
                setIsLoading(false);
                setError(json.error);
            }{
                setPlaylists(json);
                setIsLoading(false);
            }
        }

        fetchPlaylists();

    }, []);
    return spotifyObject;
}

export {usePlaylists};