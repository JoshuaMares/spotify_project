import { useEffect, useState } from "react";
import { useAuthContext } from "./useAuthContext";

const useUserMixers = () => {
    const { user } = useAuthContext();
    const [mixers, setMixers] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    let mixersObject = {mixers, isLoading, error};

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

        const fetchMixers = async () => {
            console.log('FETCHING USER MIXERS PROFILE');

            const response = await fetch(`http://localhost:4000/user/mixers`, fetchParameters);
            const json = await response.json();

            if(!response.ok){
                console.log('ERROR GETTING MIXERS PROFILE');
                setIsLoading(false);
                setError(json.error);
            }else{
                console.log('json: ', json);
                setMixers(json.mixers);
                setIsLoading(false);
            }
        }

        if(!user){
            setError('You must be logged in first');
        }else{
            fetchMixers();
        }
        return () => abortCont.abort();
    }, []);

    return mixersObject;
}

export {useUserMixers};