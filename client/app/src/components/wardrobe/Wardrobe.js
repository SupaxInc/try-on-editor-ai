import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Container, Graphics, Sprite } from 'pixi.js';
import { usePixi } from '../../pixi/contexts/PixiContext';
import { makeSpriteInteractive } from '../../pixi/utils/interactions';
import { scaleSpriteToFitContainer } from '../../pixi/utils/helper';

// TODO: Make graphics more performant
// TODO: Make items container in wardrobe carousel

const Wardrobe = ({ itemSprites }) => {
    const { wardrobeContainerRef, appRef, itemsContainerRef } = usePixi();

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

        if (!wardrobeContainerRef.current) {
            /* Setup Wardrobe container */
            const wardrobeContainer = setupWardrobeContainer();
            appRef.current.stage.addChild(wardrobeContainer);
            wardrobeContainerRef.current = appRef.current.stage.getChildByLabel('wardrobeContainer');
            // (0,0) origin is top left of canvas, imagine the wardrobe rectangle where origin is top left (0,0)
            wardrobeContainerRef.current.x = 0; // Position x to start at left of canvas
            // Position y to start at wardrobe height - the app canvas's screen height, so it starts 80% of screen
            wardrobeContainerRef.current.y = appRef.current.screen.height - wardrobeContainerRef.current.height;
        }
        
        if (!itemsContainerRef.current) {
            /* Setup Items Container */
            const itemsContainer = setupItemsContainer();
            wardrobeContainerRef.current.addChild(itemsContainer);
            itemsContainerRef.current = wardrobeContainerRef.current.getChildByLabel('itemsContainer');
            // Position at top left of wardrobe container
            itemsContainerRef.current.x = 0;
            itemsContainerRef.current.y = 0;
        }
        
    }, [appRef, wardrobeContainerRef, itemsContainerRef]);

    useEffect(() => {
        if (!itemsContainerRef.current) {
            return;
        }

        const newSprite = itemSprites[itemSprites.length - 1];
        if (newSprite) {
            newSprite.x = itemsContainerRef.current.width / 2;
            newSprite.y = itemsContainerRef.current.height / 2;
            scaleSpriteToFitContainer(newSprite, itemsContainerRef, 15);
            makeSpriteInteractive(newSprite);
            itemsContainerRef.current.addChild(newSprite);
            console.log(itemsContainerRef)
        }
    }, [itemSprites, itemsContainerRef]);

    return null; // No DOM output
}

Wardrobe.propTypes = {
    itemSprites: PropTypes.arrayOf(PropTypes.instanceOf(Sprite))
};

export default Wardrobe;