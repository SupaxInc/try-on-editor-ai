import { RESIZE_AREA_CORNER, RESIZE_AREA_MIN } from "./constants";

// TODO: Resizing is still a little jumpy
// TODO: Resizing stopped working after adding containers, check pointer position relative to sprites parent
// TODO: Need to add boundaries to containers

export const makeSpriteInteractive = (sprite, options = {}) => {
  sprite.interactive = true; // Allow sprite to interact with pointer events
  sprite.cursor = "pointer"; // Default cursor on hover

  let activeCorner = null; // Track which corner is interacted with
  let dragging = false; // Track if the sprite is being dragged
  let pointerOffsetX, pointerOffsetY; // Store initial click offset from sprite's center

  const resetResizeDraggingStates = () => {
    dragging = false;
    activeCorner = null;
    sprite.alpha = 1;
    sprite.cursor = "pointer";
    sprite.data = null;

    options?.onDropResetToInitial?.(sprite);
  };

  sprite.on("pointerdown", (event) => {
    const bounds = sprite.getBounds();
    const localPosition = event.data.getLocalPosition(sprite.parent); // Get the pointer position relative to the sprite's parent

    // Calculate offsets from the sprite's current position to the pointer position, prevents jumpy sprite behavior
    pointerOffsetX = localPosition.x - sprite.x;
    pointerOffsetY = localPosition.y - sprite.y;

    // Check if the pointer is within any corner's active resizing zone
    if (
      Math.abs(localPosition.x - bounds.x) < RESIZE_AREA_CORNER &&
      Math.abs(localPosition.y - bounds.y) < RESIZE_AREA_CORNER
    ) {
      activeCorner = "top-left";
      sprite.cursor = "nwse-resize";
    } else if (
      Math.abs(localPosition.x - (bounds.x + bounds.width)) <
        RESIZE_AREA_CORNER &&
      Math.abs(localPosition.y - bounds.y) < RESIZE_AREA_CORNER
    ) {
      activeCorner = "top-right";
      sprite.cursor = "nesw-resize";
    } else if (
      Math.abs(localPosition.x - bounds.x) < RESIZE_AREA_CORNER &&
      Math.abs(localPosition.y - (bounds.y + bounds.height)) <
        RESIZE_AREA_CORNER
    ) {
      activeCorner = "bottom-left";
      sprite.cursor = "nesw-resize";
    } else if (
      Math.abs(localPosition.x - (bounds.x + bounds.width)) <
        RESIZE_AREA_CORNER &&
      Math.abs(localPosition.y - (bounds.y + bounds.height)) <
        RESIZE_AREA_CORNER
    ) {
      activeCorner = "bottom-right";
      sprite.cursor = "nwse-resize";
    } else {
      dragging = true; // Set dragging true if not in corners
      sprite.alpha = 0.5; // Reduce opacity to indicate interaction
    }
  });

  // Resets interaction states when pointer is released
  sprite.on("pointerup", (event) => {
    if (dragging) {
      const globalPosition = event.data.global;
      if (options?.isOnTopOfSprite?.(options?.sprite, globalPosition)) {
        options?.onDropOnSprite?.(sprite);
      }
    }
    resetResizeDraggingStates();
  });
  sprite.on("pointerupoutside", resetResizeDraggingStates);

  // Handles pointer move events for resizing or dragging
  sprite.on("pointermove", (event) => {
    if (dragging) {
      const newPosition = event.data.getLocalPosition(sprite.parent);
      // Move sprite based on pointer position minus the initial offsets
      sprite.x = newPosition.x - pointerOffsetX;
      sprite.y = newPosition.y - pointerOffsetY;
    } else if (activeCorner) {
      resizeSprite(
        sprite,
        event.data.getLocalPosition(sprite.parent),
        activeCorner
      );
    }
  });
};

// Handles resizing logic based on the active corner
const resizeSprite = (sprite, newPosition, corner) => {
  switch (corner) {
    case "top-left":
      // Adjust width and height from top-left corner, moving the position to match
      sprite.width = Math.max(
        RESIZE_AREA_MIN,
        sprite.width + (sprite.x - newPosition.x)
      );
      sprite.height = Math.max(
        RESIZE_AREA_MIN,
        sprite.height + (sprite.y - newPosition.y)
      );
      sprite.x = newPosition.x;
      sprite.y = newPosition.y;
      break;
    case "top-right":
      // Adjust width and maintain right edge position, change height and top position
      sprite.width = Math.max(RESIZE_AREA_MIN, newPosition.x - sprite.x);
      sprite.height = Math.max(
        RESIZE_AREA_MIN,
        sprite.height + (sprite.y - newPosition.y)
      );
      sprite.y = newPosition.y;
      break;
    case "bottom-left":
      // Adjust height and maintain bottom edge position, change width and left position
      sprite.width = Math.max(
        RESIZE_AREA_MIN,
        sprite.width + (sprite.x - newPosition.x)
      );
      sprite.height = Math.max(RESIZE_AREA_MIN, newPosition.y - sprite.y);
      sprite.x = newPosition.x;
      break;
    case "bottom-right":
      // Adjust width and height from bottom-right corner
      sprite.width = Math.max(RESIZE_AREA_MIN, newPosition.x - sprite.x);
      sprite.height = Math.max(RESIZE_AREA_MIN, newPosition.y - sprite.y);
      break;
    default:
      break;
  }
};

// Reset sprite to initial position when dropped
export const onDropResetToInitial = (sprite) => {
  sprite.x = sprite.initialX;
  sprite.y = sprite.initialY;
};

// Check if the current position passed is on top of a specific sprite
export const isOnTopOfSprite = (sprite, currentPosition) => {
  if (!sprite) return false;

  const spriteBounds = sprite.getBounds();
  return spriteBounds.containsPoint(currentPosition.x, currentPosition.y);
};

export const onDropOnSprite = async (
  targetSprite,
  droppedSprite,
  callback,
  app
) => {
  if (targetSprite && droppedSprite) {
    // Delay the callback to ensure the sprite has been updated with correct states
    await new Promise((resolve) => setTimeout(resolve, 0));
    console.log("HEre");
    const newSprite = await callback(targetSprite, droppedSprite, app);
    console.log("newSprite", newSprite);
    if (newSprite) {
      // Replace the old sprite with the new one
      const parent = targetSprite.parent;
      const index = parent.getChildIndex(targetSprite);

      // Copy relevant properties from the old sprite
      newSprite.x = targetSprite.x;
      newSprite.y = targetSprite.y;
      newSprite.width = targetSprite.width;
      newSprite.height = targetSprite.height;
      newSprite.scale.set(targetSprite.scale.x, targetSprite.scale.y);
      newSprite.anchor.set(targetSprite.anchor.x, targetSprite.anchor.y);
      newSprite.label = targetSprite.label;

      // Remove the old sprite and add the new one
      parent.removeChild(targetSprite);
      parent.addChildAt(newSprite, index);

      // Make the new sprite interactive
      // makeSpriteInteractive(newSprite, {
      //   // Add any necessary options here
      // });
    }
  }
};
