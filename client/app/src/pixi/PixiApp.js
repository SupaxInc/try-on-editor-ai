import React, { useRef, useEffect } from 'react';
import { Application, Container } from 'pixi.js';
import { usePixi } from './contexts/PixiContext';

const PixiApp = ({ children }) => {
    const { setAppRef, setCharContainerRef, setWardrobeContainerRef } = usePixi();
    const appRef = useRef(null);
    const containerRef = useRef(null);
    const charContainerRef = useRef(null);
    const wardrobeContainerRef = useRef(null);

    useEffect(() => {
        const renderApp = async () => {
            const app = new Application();
            await app.init({
                width: 900,
                height: 900,
                backgroundColor: 0x1099bb,
            });
            
            // Only append canvas if appRef is empty
            if (!appRef.current) { 
                containerRef.current.appendChild(app.canvas);
                appRef.current = app;
                setAppRef(appRef);
            }
            
            initializePlaceholderContainers(app);
        } 

        renderApp();
        return () => {
            if (appRef.current) {
                appRef.current.destroy(true);
            }
        };
    }, []);

    const initializePlaceholderContainers = (app) => {
        const characterContainer = new Container();
        const wardrobeContainer = new Container();

        characterContainer.label = 'characterContainer';
        app.stage.addChild(characterContainer);
        charContainerRef.current = appRef.current.stage.getChildByLabel('characterContainer');
        setCharContainerRef(charContainerRef);

        wardrobeContainer.label = 'wardrobeContainer';
        app.stage.addChild(wardrobeContainer);
        wardrobeContainerRef.current = appRef.current.stage.getChildByLabel('wardrobeContainer');
        setWardrobeContainerRef(wardrobeContainerRef);
    };

    return (
        <div ref={containerRef}>
            {children}
        </div>
    );
};

export default PixiApp;