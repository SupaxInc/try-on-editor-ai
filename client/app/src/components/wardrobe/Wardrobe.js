import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Container, Graphics, Sprite } from 'pixi.js';
import { usePixi } from '../../pixi/contexts/PixiContext';
import { makeSpriteInteractive } from '../../pixi/utils/interactions';

// TODO: Make graphics more performant
// TODO: Make item sprites scale to new boundaries

const Wardrobe = ({ itemSprites }) => {
    const { wardrobeContainerRef, appRef } = usePixi();

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
        
        // Containers scales its resolution based on its children, so use graphics to create boundaries for wardrobe
        const setWardrobeBounds = () => {
            const bg = new Graphics();
            const wardrobeWidth = appRef.current.screen.width // Full width of app canvas
            const wardrobeHeight = appRef.current.screen.height * 0.2; // Remaining 20% of the height at the bottom
            bg.rect(0, 0, wardrobeWidth, wardrobeHeight);
            bg.fill({color: 0x333333, alpha: 1});

            // (0,0) origin is top left of canvas
                // Imagine the wardrobe rectangle where origin is top left (0,0)
            // Position x to start at left of canvas
            wardrobeContainerRef.current.x = 0; 
            // Position y to start at wardrobe height - the app canvas's screen height, so it starts 80% of screen
            wardrobeContainerRef.current.y = appRef.current.screen.height - wardrobeContainerRef.current.height;

            return bg;
        }
        
        if (appRef && wardrobeContainerRef.current) {
            const boundary = setWardrobeBounds();

            wardrobeContainerRef.current.addChild(boundary);
            if (itemSprites.length > 0) {
                const itemsContainer = createItemsContainer();

                // Add items container to the app stage by adding it as child of wardrobeContainer (wardrobe container already added to app stage)
                wardrobeContainerRef.current.addChild(itemsContainer);
            }
        }
    }, [wardrobeContainerRef, appRef, itemSprites]);

    return null; // No DOM output
}

Wardrobe.propTypes = {
    itemSprites: PropTypes.arrayOf(PropTypes.instanceOf(Sprite))
};

export default Wardrobe;