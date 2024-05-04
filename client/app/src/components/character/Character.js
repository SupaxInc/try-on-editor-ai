import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Sprite } from 'pixi.js';
import { makeSpriteInteractive } from '../../interaction/helper';
import { usePixi } from '../../pixi/contexts/PixiContext';

const Character = ({ charSprite }) => {
    const { appRef, charContainerRef } = usePixi();

    useEffect(() => {
        if (appRef && charSprite) {
            charContainerRef.current.addChild(charSprite);
            // Putting image to the middle and adding interactions
            charSprite.x = appRef.current.screen.width / 2;
            charSprite.y = appRef.current.screen.height / 2;
            makeSpriteInteractive(charSprite);
        }
    }, [charSprite, appRef, charContainerRef]);

    return null; // No DOM output
}

Character.propTypes = {
    charSprite: PropTypes.instanceOf(Sprite)
};

export default Character;