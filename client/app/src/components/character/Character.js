import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Sprite } from 'pixi.js';
import { makeSpriteInteractive } from '../../pixi/utils/interactions';
import { usePixi } from '../../pixi/contexts/PixiContext';

const Character = ({ charSprite }) => {
    const { appRef, charContainerRef } = usePixi();

    useEffect(() => {
        if (appRef && charSprite) {
            charContainerRef.current.addChild(charSprite);
            makeSpriteInteractive(charSprite);
        }
    }, [charSprite, appRef, charContainerRef]);

    return null; // No DOM output
}

Character.propTypes = {
    charSprite: PropTypes.instanceOf(Sprite)
};

export default Character;