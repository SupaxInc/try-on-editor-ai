import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { Container, Graphics, Sprite } from 'pixi.js';
import { usePixi } from '../../pixi/contexts/PixiContext';
import { isOnTopOfSprite, makeSpriteInteractive, onDropResetToInitial, onDropOnSprite } from '../../pixi/utils/interactions';
import { scaleSpriteToFitContainer } from '../../pixi/utils/helper';
import { triggerTryOn } from '../../api';

// TODO: Make graphics more performant

const Wardrobe = ({ itemSprites }) => {
    const { wardrobeContainerRef, appRef, itemsContainerRef, charContainerRef } = usePixi();
    const totalItemsWidthRef = useRef(0);

    // Initial setup of wardrobe container and items container
    useEffect(() => {
        // Containers scales its resolution based on its children, so use graphics to create boundaries for wardrobe
        const setWardrobeBounds = (wardrobeContainer) => {
            const boundary = new Graphics();
            const wardrobeWidth = appRef.current.screen.width; // Full width of app canvas
            const wardrobeHeight = appRef.current.screen.height * 0.25; // Remaining 20% of the height at the bottom
            boundary.rect(0, 0, wardrobeWidth, wardrobeHeight);
            boundary.fill({color: 0x333333});

            wardrobeContainer.addChild(boundary);
        }
        
        const setupWardrobeContainer = () => {
            const wardrobeContainer = new Container();
            wardrobeContainer.label = 'wardrobeContainer';
            setWardrobeBounds(wardrobeContainer);
            return wardrobeContainer;
        }

        const setItemsBounds = (itemsContainer) => {
            const boundary = new Graphics();
            const itemsWidth = wardrobeContainerRef.current.width;
            const itemsHeight = wardrobeContainerRef.current.height * 0.80;
            boundary.rect(0, 0, itemsWidth, itemsHeight);
            boundary.fill('black');

            itemsContainer.addChild(boundary);
        }

        const setupItemsContainer = () => {
            const itemsContainer = new Container();
            itemsContainer.label = 'itemsContainer';
            setItemsBounds(itemsContainer);
            return itemsContainer;
        }

        if (!appRef.current) {
            return;
        }

        /* Setup Wardrobe container */
        if (!wardrobeContainerRef.current) {
            const wardrobeContainer = setupWardrobeContainer();
            appRef.current.stage.addChild(wardrobeContainer);
            wardrobeContainerRef.current = appRef.current.stage.getChildByLabel('wardrobeContainer');
            // (0,0) origin is top left of canvas, imagine the wardrobe rectangle where origin is top left (0,0)
            wardrobeContainerRef.current.x = 0; // Position x to start at left of canvas
            // Position y to start at wardrobe height - the app canvas's screen height, so it starts 80% of screen
            wardrobeContainerRef.current.y = appRef.current.screen.height - wardrobeContainerRef.current.height;
        }
        
        /* Setup Items Container */
        if (!itemsContainerRef.current) {
            const itemsContainer = setupItemsContainer();
            wardrobeContainerRef.current.addChild(itemsContainer);
            itemsContainerRef.current = wardrobeContainerRef.current.getChildByLabel('itemsContainer');
            // Position at top left of wardrobe container
            itemsContainerRef.current.x = 0;
            itemsContainerRef.current.y = 0;
        }

        return () => {
            // No need to destroy items container or item sprites as its children of wardrobe container
            if (wardrobeContainerRef.current) {
                wardrobeContainerRef.current.destroy(true);
                wardrobeContainerRef.current = null;
                itemsContainerRef.current = null;
            }
        }
    }, [appRef, wardrobeContainerRef, itemsContainerRef]);

    // Add newly uploaded item sprites to items container and add interactions
    useEffect(() => {
        if (!itemsContainerRef.current || itemSprites.length === 0) {
            return;
        }

        const newItemSprite = itemSprites[itemSprites.length - 1]; // Last added sprite
        const characterSprite = charContainerRef.current.children.find(child => child.label === 'characterSprite');

        // Scale the sprite to container before positioning calculations
        scaleSpriteToFitContainer(newItemSprite, itemsContainerRef, 15);

        // Position new sprite in the items container
        // TODO: Need to add with item sprite width (scaled) and not just spacing
        const itemSpacing = 200;
        const newPositionX = itemSprites.length > 1 ? totalItemsWidthRef.current + itemSpacing : 150;
        newItemSprite.x = newPositionX;
        newItemSprite.y = itemsContainerRef.current.height / 2; // Middle of the items container

        // Storing new initialX and initialY properties to sprite object to be used for onDropResetToInitial
        newItemSprite.initialX = newPositionX;
        newItemSprite.initialY = itemsContainerRef.current.height / 2; // Middle of the items container

        // Add interactions to the new item sprite
        makeSpriteInteractive(newItemSprite, 
            { 
                onDropResetToInitial, 
                isOnTopOfSprite, 
                sprite: characterSprite, 
                onDropOnSprite: (droppedSprite) => onDropOnSprite(characterSprite, droppedSprite, triggerTryOn, appRef.current)
            }
        );

        // Add the new item sprite to the items container (adding it to the stage)
        itemsContainerRef.current.addChild(newItemSprite);

        // Increase total items width to account for new sprite
        totalItemsWidthRef.current += newPositionX;
    }, [itemSprites, itemsContainerRef, charContainerRef]);

    return null; // No DOM output
}

Wardrobe.propTypes = {
    itemSprites: PropTypes.arrayOf(PropTypes.instanceOf(Sprite))
};

export default Wardrobe;