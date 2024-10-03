import { Container, Graphics, Sprite, Texture, Application } from "pixi.js";
import { AllSetupSprites, ItemSprite, NamedContainer } from "../types";
import { MutableRefObject } from "react";

export const drawDebugBounds = (container: Container): void => {
  const graphics = new Graphics();
  graphics.stroke({ width: 2, color: 0xff0000, alpha: 1 });
  graphics.rect(0, 0, container.width, container.height);
  container.addChild(graphics);
  console.log("Container dimensions:", container.width, container.height);
};

// TODO: Possibly add responsive scaling?
export const scaleSpriteToFitContainer = (
  sprite: Sprite,
  containerRef: MutableRefObject<Container | null>,
  padding: number = 0
): void => {
  if (!containerRef.current) {
    return;
  }
  const containerBounds = containerRef.current.getLocalBounds();

  // Add padding to the container width and height, multiply by 2 to account for top/bottom, left/right sides.
  // Adds padding to container to effectively make container smaller or bigger for better scaling
  const effectiveWidth = containerBounds.width - padding * 2;
  const effectiveHeight = containerBounds.height - padding * 2;

  // Texture represents original dimensions of the sprite
  // Sprite dimensions (sprite.height, .width) are affected by the sprite's scale properties
  const texture: Texture = sprite.texture;
  const spriteWidth = texture.orig.width;
  const spriteHeight = texture.orig.height;

  const scaleX = effectiveWidth / spriteWidth;
  const scaleY = effectiveHeight / spriteHeight;

  // Use the smallest scale factor to maintain aspect ratio
  const scale = Math.min(scaleX, scaleY);

  // Scale the sprite's scale x and y to the scale factor
  sprite.scale.set(scale);
};

export const isItemSprite = (sprite: AllSetupSprites): sprite is ItemSprite => {
  return "initialX" in sprite && "initialY" in sprite;
};
