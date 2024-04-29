import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Application, Sprite } from 'pixi.js';
import { makeSpriteInteractive } from '../../interaction/helper';

const CharacterPlaceholder = ({ sprite }) => {
    const charContainerRef = useRef(null);
    const appRef = useRef(null);

    useEffect(() => {
        const renderCharContainer = async () => {
            const app = new Application();
            await app.init({
                width: 800,
                height: 600,
                backgroundColor: 0x1099bb,
            });
            
            // Only append canvas if appRef is empty
            if (!appRef.current) { 
                charContainerRef.current.appendChild(app.canvas);
                appRef.current = app;
            }
        } 

        renderCharContainer();
        return () => {
            if (appRef.current) {
                appRef.current.destroy(true);
            }
        };
    }, []);

    useEffect(() => {
        if (appRef.current && sprite) {
            appRef.current.stage.addChild(sprite);
            sprite.x = appRef.current.screen.width / 2;
            sprite.y = appRef.current.screen.height / 2;
            makeSpriteInteractive(sprite);
        }
    }, [sprite]);

    return (
        <div ref={charContainerRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        </div>
    )
}

CharacterPlaceholder.propTypes = {
    sprite: PropTypes.instanceOf(Sprite)
};

export default CharacterPlaceholder;