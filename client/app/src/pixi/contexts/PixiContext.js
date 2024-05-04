import React, { createContext, useContext, useState } from 'react';

const PixiContext = createContext();

export const usePixi = () => useContext(PixiContext);

export const PixiProvider = ({ children }) => {
    const [appRef, setAppRef] = useState(null);
    const [charContainerRef, setCharContainerRef] = useState(null);
    const [wardrobeContainerRef, setWardrobeContainerRef] = useState(null);

    return (
        <PixiContext.Provider value={{
            appRef, setAppRef,
            charContainerRef, setCharContainerRef,
            wardrobeContainerRef, setWardrobeContainerRef
        }}>
            {children}
        </PixiContext.Provider>
    );
};
