import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Application, Sprite } from 'pixi.js';
import { makeSpriteInteractive } from '../../interaction/helper';

const ItemsPlaceholder = ({ sprites }) => {
    const itemsContainerRef = useRef(null);
    const appRef = useRef(null);

    useEffect(() => {
        const renderItemsContainer = async () => {
            const app = new Application();
            await app.init({
                width: 800,
                height: 200,
                backgroundColor: 0x1099bb,
            });
            
            // Only append canvas if appRef is empty
            if (!appRef.current) { 
                itemsContainerRef.current.appendChild(app.canvas);
                appRef.current = app;
            }
        } 

        renderItemsContainer();
        return () => {
            if (appRef.current) {
                appRef.current.destroy(true);
            }
        };
    }, []);

    useEffect(() => {
        if (appRef.current) {
            sprites.forEach(sprite => {
                appRef.current.stage.addChild(sprite);
                // Putting image to the middle
                sprite.x = appRef.current.screen.width / 2;
                sprite.y = appRef.current.screen.height / 2;
                makeSpriteInteractive(sprite);
            });
        }
    }, [sprites]);

    return (
        <div ref={itemsContainerRef}>
        </div>
    )
}

ItemsPlaceholder.propTypes = {
    sprites: PropTypes.arrayOf(Sprite)
};

export default ItemsPlaceholder;