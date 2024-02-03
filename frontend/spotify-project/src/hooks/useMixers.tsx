import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

function useMixers(){
    const { user } = useAuthContext();
    const [isLoading, setIsLoading] = useState<null | Boolean>(null);
    const [error, setError] = useState<null | String>(null);

    const createMixer = async (playlistName: string, playlistDesc: string, invitees: Array<string>, constituentPlaylists: Array<string>) => {
        /* 
        When creating a mixer we want to
            -> create the playlist
                ->give playlist name
                ->give playlist description
            ->add the relevant music to the playlist
            ->register as a mixer in db
            ->register mixer to users
        */
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