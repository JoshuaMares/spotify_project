import { useEffect, useState } from "react";
import { useAuthContext } from "./useAuthContext";

const useUserProfile = (userID: string) => {
    const { user } = useAuthContext();
    const [userProfile, setUserProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    let userProfileObject = {userProfile, setUserProfile, isLoading, setIsLoading, error, setError};

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
            console.log('FETCHING USER PROFILE');

            const response = await fetch(`http://localhost:4000/user/${userID}/profile`, fetchParameters);
            const json = await response.json();

            if(!response.ok){
                console.log('ERROR GETTING PROFILE');
                setIsLoading(false);
                setError(json.error);
            }else{
                console.log('json: ', json);
                setUserProfile(json.profile);
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

    return userProfileObject;
}

export {useUserProfile};