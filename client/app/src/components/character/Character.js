import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Graphics, Sprite } from 'pixi.js';
import { makeSpriteInteractive } from '../../pixi/utils/interactions';
import { usePixi } from '../../pixi/contexts/PixiContext';

const Character = ({ charSprite }) => {
    const { appRef, charContainerRef } = usePixi();

    useEffect(() => {
        if (appRef && charContainerRef.current) {
            const bg = new Graphics();
            const charWidth = appRef.current.screen.width
            const charHeight = appRef.current.screen.height * 0.8; // Remaining 20% of the height at the bottom
            bg.rect(0, 0, charWidth, charHeight);
            bg.fill({color: 0xFFFFFF, alpha: 1});
            bg.stroke({width: 2, color: 0xFF0000, alpha: 1});
            charContainerRef.current.x = 0;
            charContainerRef.current.y = 0;
            charContainerRef.current.addChild(bg);
            
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