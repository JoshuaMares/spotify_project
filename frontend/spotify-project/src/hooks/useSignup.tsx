import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
    const [isLoading, setIsLoading] = useState<null | Boolean>(null);
    const [error, setError] = useState<null | String>(null);
    const { dispatch } = useAuthContext();

    const signup = async(email: String, password: String) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch('http://localhost:4000/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password})
        });
        const json = await response.json();

        if(!response.ok){
            setIsLoading(false);
            setError(json.error);
        }else{
            //save to local storage
            localStorage.setItem('user', JSON.stringify(json));

            //update auth context
            dispatch({type: 'LOGIN', payload: json});

            setIsLoading(false);
        }
    }

    return {signup, isLoading, error}; 
}