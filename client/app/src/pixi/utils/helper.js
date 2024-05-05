import { Graphics } from "pixi.js";

export const drawDebugBounds = (container) => {
    const graphics = new Graphics();
    graphics.stroke({width: 2, color: 0xFF0000, alpha: 1});
    graphics.rect(0, 0, container.width, container.height);
    container.addChild(graphics);
    console.log("Container dimensions:", container.width, container.height);
};

export const scaleSpriteToFitContainer = (sprite, containerRef) => {
    // Texture represents original dimensions of the sprite
        // Sprite dimensions (sprite.height, .width) are affected by the sprite's scale properties
    const spriteWidth = sprite.texture.width;
    const spriteHeight = sprite.texture.height;

    const scaleX = containerRef.current.width / spriteWidth;
    const scaleY = containerRef.current.height / spriteHeight;
    
    // Use the smallest scale factor to maintain aspect ratio
    const scale = Math.min(scaleX, scaleY);

    // Scale the sprite's scale x and y to the scale factor
    sprite.scale.set(scale, scale);
};
