import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Application, Sprite } from 'pixi.js';

const CharacterPlaceholder = ({ sprite }) => {
    const charContainerRef = useRef(null);
    const appRef = useRef(null);

    useEffect(() => {
        const renderCharContainer = async () => {
            const app = new Application();
            await app.init({
                width: 800,
                height: 600,
                backgroundColor: 0x1099bb,
            });
            
            // Only append canvas is appRef is empty
            if (!appRef.current) { 
                charContainerRef.current.appendChild(app.canvas);
                appRef.current = app;
            }
        } 

        renderCharContainer();
        return () => {
            if (appRef.current) {
                appRef.current.destroy(true, true);
            }
        };
    }, []);

    useEffect(() => {
        if (appRef.current && sprite) {
            appRef.current.stage.addChild(sprite);
            sprite.x = appRef.current.screen.width / 2;
            sprite.y = appRef.current.screen.height / 2;
            makeSpriteInteractive(sprite);
        }
    }, [sprite]);

    const makeSpriteInteractive = (sprite) => {
        sprite.interactive = true;
        sprite.buttonMode = true;

        let dragging = false;
        let resizing = false;
        let pointerOffsetX, pointerOffsetY;

        sprite
            .on('pointerdown', (event) => {
                const localPosition = event.data.getLocalPosition(sprite);
                pointerOffsetX = localPosition.x;
                pointerOffsetY = localPosition.y;

                if (pointerOffsetX > sprite.width - 20 && pointerOffsetY > sprite.height - 20) {
                    // If pointer is in the lower-right corner of the sprite
                    resizing = true;
                    sprite.alpha = 0.8;
                } else {
                    dragging = true;
                    sprite.alpha = 0.5;
                }
                sprite.data = event.data;
            })
            .on('pointerup', () => {
                dragging = false;
                resizing = false;
                sprite.alpha = 1;
                sprite.data = null;
            })
            .on('pointerupoutside', () => {
                dragging = false;
                resizing = false;
                sprite.alpha = 1;
                sprite.data = null;
            })
            .on('pointermove', () => {
                if (dragging) {
                    const newPosition = sprite.data.getLocalPosition(sprite.parent);
                    sprite.x = newPosition.x - pointerOffsetX;
                    sprite.y = newPosition.y - pointerOffsetY;
                }
                if (resizing) {
                    const newPosition = sprite.data.getLocalPosition(sprite.parent);
                    const newWidth = Math.max(100, newPosition.x - sprite.x);
                    const newHeight = Math.max(100, newPosition.y - sprite.y);
                    sprite.width = newWidth;
                    sprite.height = newHeight;
                }
            });
    };

    return (
        <div ref={charContainerRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        </div>
    )
}

CharacterPlaceholder.propTypes = {
    sprite: PropTypes.instanceOf(Sprite)
};

export default CharacterPlaceholder;