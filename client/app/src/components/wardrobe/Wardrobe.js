import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Container, Sprite } from 'pixi.js';
import { usePixi } from '../../pixi/contexts/PixiContext';
import { makeSpriteInteractive } from '../../pixi/utils/interactions';

const Wardrobe = ({ itemSprites }) => {
    const { wardrobeContainerRef } = usePixi();

    useEffect(() => {
        const createItemsContainer = () => {
            const itemsContainer = new Container();
            itemsContainer.label = 'itemContainer';
    
            itemSprites.forEach((sprite) => {
                makeSpriteInteractive(sprite);
                itemsContainer.addChild(sprite);
            });
    
            return itemsContainer;
        }
        
        if (wardrobeContainerRef.current && itemSprites.length > 0) {
            const itemsContainer = createItemsContainer();

            // Add items container to the app stage as child of wardrobeContainer (wardrobe container already added to app stage)
            wardrobeContainerRef.current.addChild(itemsContainer);
        }
    }, [wardrobeContainerRef, itemSprites]);

    return null; // No DOM output
}

Wardrobe.propTypes = {
    itemSprites: PropTypes.arrayOf(PropTypes.instanceOf(Sprite))
};

export default Wardrobe;