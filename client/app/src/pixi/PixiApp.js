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
        const initializePlaceholderContainers = (app) => {
            setupCharContainer(app);
            setupWardrobeContainer(app);
            
            charContainerRef.current = appRef.current.stage.getChildByLabel('characterContainer');
            wardrobeContainerRef.current = appRef.current.stage.getChildByLabel('wardrobeContainer');
            setCharContainerRef(charContainerRef);
            setWardrobeContainerRef(wardrobeContainerRef);
        };

        const setupCharContainer = (app) => {
            const characterContainer = new Container();
            characterContainer.label = 'characterContainer';
            app.stage.addChild(characterContainer);
            
            characterContainer.x = app.screen.width / 2;
            characterContainer.y = 0;
        }

        const setupWardrobeContainer = (app) => {
            const wardrobeContainer = new Container();
            wardrobeContainer.label = 'wardrobeContainer';
            app.stage.addChild(wardrobeContainer);

            wardrobeContainer.x = app.screen.width / 2;
            wardrobeContainer.y = app.screen.height - 150;
        }



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
    }, [setCharContainerRef, setWardrobeContainerRef, setAppRef]);

    return (
        <div ref={containerRef}>
            {children}
        </div>
    );
};

export default PixiApp;