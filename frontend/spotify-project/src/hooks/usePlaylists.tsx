import { useEffect, useState } from "react";

const usePlaylists = () => {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    let spotifyObject = {data, setData, isLoading, setIsLoading, isFinished, setIsFinished, error, setError};

    useEffect(() => {
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

        fetch(BACKEND_URL + 'playlists', fetchParameters)
            .then((response) => {
                return {'response': response, 'json': response.json()};
            }).then((responseObj) => {
                if(!responseObj.response.ok){
                    setIsLoading(false);
                    setError(responseObj.json.error);
                }else{
                    setData(responseObj.json);
                    setIsLoading(false)
                }
            })

    }, []);
    return spotifyObject;
}

export {usePlaylists};