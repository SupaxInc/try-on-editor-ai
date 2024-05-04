import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Sprite } from 'pixi.js';
import { makeSpriteInteractive } from '../../interaction/helper';
import { usePixi } from '../../pixi/contexts/PixiContext';

const ItemPlaceholder = ({ sprite, onSpriteModified }) => {
    const { appRef } = usePixi();

    useEffect(() => {
        if (appRef.current) {
            makeSpriteInteractive(sprite);
            sprite.x = 100;
            onSpriteModified(sprite);

            return () => {
                sprite.destroy();
            }
        }
    }, [appRef, sprite, onSpriteModified]);

    return null; // No DOM output
}

ItemPlaceholder.propTypes = {
    itemSprite: PropTypes.instanceOf(Sprite)
};

export default ItemPlaceholder;