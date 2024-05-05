import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Graphics, Sprite } from 'pixi.js';
import { makeSpriteInteractive } from '../../pixi/utils/interactions';
import { usePixi } from '../../pixi/contexts/PixiContext';

// TODO: Make sprites scale to new boundaries

const Character = ({ charSprite }) => {
    const { appRef, charContainerRef } = usePixi();

    useEffect(() => {
        // Containers scales its resolution based on its children, so use graphics to create boundaries for character
        const setCharacterBounds = () => {
            const bg = new Graphics();
            const charWidth = appRef.current.screen.width
            const charHeight = appRef.current.screen.height * 0.8; // Remaining 80% of the height at the bottom
            bg.rect(0, 0, charWidth, charHeight);
            bg.fill({color: 0xFFFFFF, alpha: 1});
            bg.stroke({width: 2, color: 0xFF0000, alpha: 1});

            // Position x to left of canvas (parent)
            charContainerRef.current.x = 0;
            // Position y to start at the top of the canvas
            charContainerRef.current.y = 0;
            // Positions combination with height and width of container creates a rectangle covering 80% of canvas
        }
        
        if (appRef && charContainerRef.current) {
            const boundary = setCharacterBounds();
           
            charContainerRef.current.addChild(boundary);
            if (charSprite) {
                charContainerRef.current.addChild(charSprite);
                makeSpriteInteractive(charSprite);
            }
        }
    }, [charSprite, appRef, charContainerRef]);

    return null; // No DOM output
}

Character.propTypes = {
    charSprite: PropTypes.instanceOf(Sprite)
};

export default Character;