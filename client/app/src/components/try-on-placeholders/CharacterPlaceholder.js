import React, { useRef, useEffect } from 'react';

import { Application } from 'pixi.js';

const CharacterPlaceholder = ({ sprite }) => {
    const charContainer = useRef(null);
    const appRef = useRef(null);

    useEffect(() => {
        async function renderCharContainer() {
            const app = new Application();
            
            await app.init({
                width: 800,
                height: 600,
                backgroundColor: 0x1099bb, 
                autoDensity: true, 
            });
            
            charContainer.current.appendChild(app.canvas);
            appRef.current = app;
        } 
        
        renderCharContainer();

    }, [appRef]);

    useEffect(() => {
        if (appRef.current && sprite) {
            sprite.x = (appRef.current.screen.width - sprite.width) / 2;
            sprite.y = (appRef.current.screen.height - sprite.height) / 2;
            appRef.current.stage.addChild(sprite);
        }
    }, [sprite])

    return (
        <div ref={charContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        </div>
    )
}

export default CharacterPlaceholder;