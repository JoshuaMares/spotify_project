import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

function useMixers(){
    const { user } = useAuthContext();
    const [isLoading, setIsLoading] = useState<null | Boolean>(null);
    const [error, setError] = useState<null | String>(null);

    const createMixer = async (playlistName: string, playlistDesc: string, invitees: Array<string>, constituentPlaylists: Array<string>) => {
        setIsLoading(true);
        setError(null);

        const abortCont = new AbortController();
        let fetchParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ('Bearer ' + user.jwt),
            },
            body: JSON.stringify({
                playlistName,
                playlistDesc,
                invitees,
                constituentPlaylists
            }),
            signal: abortCont.signal
        }

        const response  = await fetch('http://localhost:4000/mixers/create', fetchParameters);
        const json = await response.json();

        if(!response.ok){
            setIsLoading(false);
            setError(json.error);
        }else{
            
            setIsLoading(false);
        }
    }

    return {createMixer, isLoading, error};
}