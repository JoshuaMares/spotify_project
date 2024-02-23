import { createContext, useEffect, useReducer } from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN':
            return { 'user': action.payload, };
        case 'LOGOUT':
            return { 'user': null, };
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    //children is the component we wrap
    const userJSON = JSON.parse(localStorage.getItem('user')) || null;
    const [state, dispatch] = useReducer(authReducer, {
        user: userJSON, 
    });

    // useEffect(() => {
    //     const user = localStorage.getItem('user');

    //     if(user){
    //         const userJSON= JSON.parse(user);
    //         dispatch({type: 'LOGIN', payload: userJSON })
    //     }else{
    //         //window.location.href = 'http://localhost:5173/'; //landing
    //     }
    // }, []);

    console.log('AuthContext State: ', state);

    //anything in value can then be accessed anywhere else in application
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    );
}