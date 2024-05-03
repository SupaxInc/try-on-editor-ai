import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Application, Sprite, Container } from 'pixi.js';
import { makeSpriteInteractive } from '../../interaction/helper';

const CharacterPlaceholder = ({ charSprite }) => {
    const containerRef = useRef(null);
    const appRef = useRef(null);
    const charContainerRef = useRef(null);
    const wardrobeContainerRef = useRef(null);

    useEffect(() => {
        const renderCharContainer = async () => {
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
            }

            initializePlaceholderContainers(app);
        } 

        renderCharContainer();
        return () => {
            if (appRef.current) {
                appRef.current.destroy(true);
            }
        };
    }, []);

    useEffect(() => {
        if (appRef.current && charSprite) {
            charContainerRef.current.addChild(charSprite);
            console.log(charContainerRef);
            // Putting image to the middle and adding interactions
            charSprite.x = appRef.current.screen.width / 2;
            charSprite.y = appRef.current.screen.height / 2;
            makeSpriteInteractive(charSprite);
        }
    }, [charSprite]);

    const initializePlaceholderContainers = (app) => {
        const characterContainer = new Container();
        const wardrobeContainer = new Container();

        characterContainer.label = 'characterContainer';
        app.stage.addChild(characterContainer);
        charContainerRef.current = appRef.current.stage.getChildByLabel('characterContainer');
        console.log(charContainerRef);

        wardrobeContainer.label = 'wardrobeContainer';
        app.stage.addChild(wardrobeContainer);
        wardrobeContainerRef.current = appRef.current.stage.getChildByLabel('wardrobeContainer');
    };

    return (
        <div ref={containerRef}>
        </div>
    )
}

CharacterPlaceholder.propTypes = {
    charSprite: PropTypes.instanceOf(Sprite)
};

export default CharacterPlaceholder;