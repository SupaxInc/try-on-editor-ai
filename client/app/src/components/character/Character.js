import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Graphics, Sprite } from 'pixi.js';
import { makeSpriteInteractive } from '../../pixi/utils/interactions';
import { usePixi } from '../../pixi/contexts/PixiContext';
import { scaleSpriteToFitContainer } from '../../pixi/utils/helper';

// TODO: Make graphics more performant
// TODO: Make sprites scale to new boundaries

const Character = ({ charSprite }) => {
    const { appRef, charContainerRef } = usePixi();

    useEffect(() => {
        // Containers scales its resolution based on its children, so use graphics to create boundaries for character
        const setCharacterBounds = () => {
            const boundary = new Graphics();
            const charWidth = appRef.current.screen.width;
            const charHeight = appRef.current.screen.height * 0.75; // Remaining 80% of the height at the bottom
            boundary.rect(0, 0, charWidth, charHeight);
            boundary.fill({color: 0xFFFFFF, alpha: 1});
            boundary.stroke({width: 2, color: 0xFF0000, alpha: 1});

            // Position x to left of canvas (parent)
            charContainerRef.current.x = 0;
            // Position y to start at the top of the canvas
            charContainerRef.current.y = 0;
            // Positions combination with height and width of container creates a rectangle covering 80% of canvas

            return boundary;
        }

        if (appRef && charContainerRef.current) {
            const boundary = setCharacterBounds();
           
            charContainerRef.current.addChild(boundary);
            if (charSprite) {
                // Move sprite to center of character boundaries
                charSprite.x = charContainerRef.current.width / 2;
                charSprite.y = charContainerRef.current.height / 2;
                scaleSpriteToFitContainer(charSprite, charContainerRef);
                makeSpriteInteractive(charSprite);
                charContainerRef.current.addChild(charSprite);
            }
        }
    }, [charSprite, appRef, charContainerRef]);

    return null; // No DOM output
}

Character.propTypes = {
    charSprite: PropTypes.instanceOf(Sprite)
};

export default Character;