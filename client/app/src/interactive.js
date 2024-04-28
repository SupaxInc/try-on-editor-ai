export const makeSpriteInteractive = (sprite) => {
    sprite.interactive = true;
    sprite.cursor = 'pointer'; // TODO: This isn't working

    let dragging = false;
    let resizing = false;
    let pointerOffsetX, pointerOffsetY;

    sprite
        .on('pointerdown', (event) => {
            const localPosition = event.data.getLocalPosition(sprite);
            pointerOffsetX = localPosition.x;
            pointerOffsetY = localPosition.y;

            // TODO: Bug here, when image resizes, image is too small which makes it resize always when clciking
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