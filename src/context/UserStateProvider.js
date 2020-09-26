import React, { createContext, useContext, useReducer } from 'react';

const StateContext = createContext();

export const UserStateProvider = ({ initialState, reducer, children }) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
)

export const useStateValue = () => useContext(StateContext);