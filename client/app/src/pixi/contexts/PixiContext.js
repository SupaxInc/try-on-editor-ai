import React, { createContext, useContext, useRef } from 'react';

const PixiContext = createContext();

export const usePixi = () => useContext(PixiContext);

export const PixiProvider = ({ children }) => {
    const appRef = useRef(null);
    const charContainerRef = useRef(null);
    const wardrobeContainerRef = useRef(null);
    const itemsContainerRef = useRef(null);

    return (
        <PixiContext.Provider value={{
            appRef,
            charContainerRef,
            wardrobeContainerRef,
            itemsContainerRef,
        }}>
            {children}
        </PixiContext.Provider>
    );
};
