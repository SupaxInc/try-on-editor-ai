import { Sprite, Container, Application, Ticker } from "pixi.js";
import { AllSetupSprites, ItemSprite } from "../types";

// Reset sprite to initial position when dropped
export const onDropResetToInitial = (sprite: ItemSprite): void => {
  sprite.x = sprite.initialX;
  sprite.y = sprite.initialY;
};

// Check if the current position passed is on top of a specific sprite
export const isOnTopOfSprite = (
  sprite: AllSetupSprites | null,
  currentPosition: { x: number; y: number }
): boolean => {
  if (!sprite) return false;
  const spriteBounds = sprite.getBounds();
  return spriteBounds.containsPoint(currentPosition.x, currentPosition.y);
};

export const onDropOnSpriteTryOn = async (
  targetSprite: AllSetupSprites,
  droppedSprite: AllSetupSprites,
  triggerTryOn: (
    targetSprite: AllSetupSprites,
    droppedSprite: AllSetupSprites,
    app: Application
  ) => Promise<Sprite | null>,
  app: Application
): Promise<Sprite | null> => {
  if (targetSprite && droppedSprite) {
    // Delay the callback to ensure the sprite has been updated with correct states
    await new Promise((resolve) => setTimeout(resolve, 0));

    const newSprite = await triggerTryOn(targetSprite, droppedSprite, app);
    if (newSprite) {
      // Copy properties from targetSprite to newSprite
      newSprite.x = targetSprite.x;
      newSprite.y = targetSprite.y;
      newSprite.width = targetSprite.width;
      newSprite.height = targetSprite.height;
      newSprite.anchor.set(targetSprite.anchor.x, targetSprite.anchor.y);

      // Remove the old sprite and add the new one
      const parent = targetSprite.parent as Container;
      const index = parent.getChildIndex(targetSprite);
      parent.removeChild(targetSprite); // Remove old sprite from parent character container
      parent.addChildAt(newSprite, index); // Add new sprite to the parent container in the same index

      return newSprite;
    }
  }
  return null;
};
