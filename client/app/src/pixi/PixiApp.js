import React, { useRef, useEffect, useState } from 'react';
import { Application } from 'pixi.js';
import { usePixi } from './contexts/PixiContext';

const PixiApp = ({ children }) => {
    const { appRef } = usePixi();
    const containerRef = useRef(null);
    const [isReady, setIsReady] = useState(false);


    useEffect(() => {
        const renderApp = async () => {
            const app = new Application();
            await app.init({
                width: 900,
                height: 900,
                backgroundColor: 0x1099bb,
            });

            // Only append canvas when app is ready to be initialized
            if (!appRef.current) { 
                containerRef.current.appendChild(app.canvas);
                appRef.current = app;
                setIsReady(true); // TODO: Add a spinner here
            }
        } 

        renderApp();
        return () => {
            if (appRef.current) {
                appRef.current.destroy(true);
            }
        };
    }, [appRef]);

    return (
        <div ref={containerRef}>
            {isReady ? children : null}
        </div>
    );
};

export default PixiApp;