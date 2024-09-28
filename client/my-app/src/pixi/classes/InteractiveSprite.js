import { Sprite } from "pixi.js";
import { RESIZE_AREA_CORNER, RESIZE_AREA_MIN } from "../utils/constants";

class InteractiveSprite {
  constructor(texture, options = {}) {
    this.sprite = new Sprite(texture);
    this.options = {
      draggable: true,
      resizable: true,
      droppable: false,
      ...options,
    };

    this.initialize();
  }

  initialize() {
    this.sprite.interactive = true;
    this.sprite.buttonMode = true;

    // Initial global states for the sprite, prevents interaction conflicts
    this.sprite.cursor = "pointer";
    this._dragging = false;
    this._resizing = false;
    this.activeCorner = null;

    if (this.options.draggable) {
      this.enableDragging();
    }

    if (this.options.resizable) {
      this.enableResizing();
    }

    if (this.options.droppable) {
      this.enableDropping();
    }

    // Initialize other interactions as needed
  }

  enableDragging() {
    let pointerOffsetX, pointerOffsetY;

    this.onDragStart = (event) => {
      if (this._resizing) return; // Don't start dragging if resizing

      // Get the pointer position relative to the sprite's parent
      const localPosition = event.data.getLocalPosition(this.sprite.parent);

      // Calculate offsets from the sprite's current position to the pointer position, prevents jumpy sprite behavior
      pointerOffsetX = localPosition.x - this.sprite.x;
      pointerOffsetY = localPosition.y - this.sprite.y;

      // Change sprites states to indicate its being dragged
      this._dragging = true;
      this.sprite.alpha = 0.5;
      this.sprite.cursor = "grabbing";

      if (this.options.onDragStart) {
        this.options.onDragStart(this, event);
      }

      // Stop event from propagating further to parent elements
      event.stopPropagation();
    };

    this.onDragMove = (event) => {
      if (this._dragging) {
        const newPosition = event.data.getLocalPosition(this.sprite.parent);

        // Move sprite based on pointer position minus the initial offsets
        this.sprite.x = newPosition.x - pointerOffsetX;
        this.sprite.y = newPosition.y - pointerOffsetY;

        if (this.options.onDragMove) {
          this.options.onDragMove(this, event);
        }
      }
    };

    this.onDragEnd = (event) => {
      if (this._dragging) {
        // Reset global states
        this._dragging = false;
        this.sprite.alpha = 1;
        this.sprite.cursor = "pointer";

        if (this.options.onDragEnd) {
          this.options.onDragEnd(this, event);
        }
      }
    };

    // Add event listeners for dragging
    this.on("pointerdown", this.onDragStart);
    this.on("pointermove", this.onDragMove);
    this.on("pointerup", this.onDragEnd);
    this.on("pointerupoutside", this.onDragEnd);
  }

  enableResizing() {
    this.onResizeStart = (event) => {
      const bounds = this.sprite.getBounds();
      const localPosition = event.data.getLocalPosition(this.sprite.parent);

      // Check corners for resizing
      if (
        Math.abs(localPosition.x - bounds.x) < RESIZE_AREA_CORNER &&
        Math.abs(localPosition.y - bounds.y) < RESIZE_AREA_CORNER
      ) {
        this.activeCorner = "top-left";
        this.sprite.cursor = "nwse-resize";
      } else if (
        Math.abs(localPosition.x - (bounds.x + bounds.width)) <
          RESIZE_AREA_CORNER &&
        Math.abs(localPosition.y - bounds.y) < RESIZE_AREA_CORNER
      ) {
        this.activeCorner = "top-right";
        this.sprite.cursor = "nesw-resize";
      } else if (
        Math.abs(localPosition.x - bounds.x) < RESIZE_AREA_CORNER &&
        Math.abs(localPosition.y - (bounds.y + bounds.height)) <
          RESIZE_AREA_CORNER
      ) {
        this.activeCorner = "bottom-left";
        this.sprite.cursor = "nesw-resize";
      } else if (
        Math.abs(localPosition.x - (bounds.x + bounds.width)) <
          RESIZE_AREA_CORNER &&
        Math.abs(localPosition.y - (bounds.y + bounds.height)) <
          RESIZE_AREA_CORNER
      ) {
        this.activeCorner = "bottom-right";
        this.sprite.cursor = "nwse-resize";
      }

      if (this.activeCorner) {
        this._resizing = true;
        if (this.options.onResizeStart) {
          this.options.onResizeStart(this, event);
        }

        event.stopPropagation();
      }
    };

    this.onResizeMove = (event) => {
      if (this._resizing) {
        const newPosition = event.data.getLocalPosition(this.sprite.parent);
        this.resizeSprite(newPosition, this.activeCorner);

        if (this.options.onResizeMove) {
          this.options.onResizeMove(this, event);
        }
      }
    };

    this.onResizeEnd = (event) => {
      if (this._resizing) {
        // Reset global states
        this._resizing = false;
        this.activeCorner = null;
        this.sprite.cursor = "pointer";

        if (this.options.onResizeEnd) {
          this.options.onResizeEnd(this, event);
        }
      }
    };

    this.on("pointerdown", this.onResizeStart);
    this.on("pointermove", this.onResizeMove);
    this.on("pointerup", this.onResizeEnd);
    this.on("pointerupoutside", this.onResizeEnd);
  }

  resizeSprite(sprite, newPosition, corner) {
    const minWidth = this.sprite.minWidth || RESIZE_AREA_MIN;
    const minHeight = this.sprite.minHeight || RESIZE_AREA_MIN;

    switch (corner) {
      case "top-left": {
        // Calculate new width and height based on the difference between current position and new position
        const newWidthTL = sprite.width + (sprite.x - newPosition.x);
        const newHeightTL = sprite.height + (sprite.y - newPosition.y);

        // If new width is greater than or equal to minimum width, update sprite's width and x position
        if (newWidthTL >= minWidth) {
          this.sprite.width = newWidthTL;
          this.sprite.x = newPosition.x;
        }
        // If new height is greater than or equal to minimum height, update sprite's height and y position
        if (newHeightTL >= minHeight) {
          this.sprite.height = newHeightTL;
          this.sprite.y = newPosition.y;
        }
        break;
      }

      case "top-right": {
        // Calculate new width and height based on the difference between current position and new position
        const newWidthTR = newPosition.x - sprite.x;
        const newHeightTR = sprite.height + (sprite.y - newPosition.y);

        // If new width is greater than or equal to minimum width, update sprite's width
        if (newWidthTR >= minWidth) {
          this.sprite.width = newWidthTR;
        }
        // If new height is greater than or equal to minimum height, update sprite's height and y position
        if (newHeightTR >= minHeight) {
          this.sprite.height = newHeightTR;
          this.sprite.y = newPosition.y;
        }
        break;
      }

      case "bottom-left": {
        // Calculate new width and height based on the difference between current position and new position
        const newWidthBL = sprite.width + (sprite.x - newPosition.x);
        const newHeightBL = newPosition.y - sprite.y;

        // If new width is greater than or equal to minimum width, update sprite's width and x position
        if (newWidthBL >= minWidth) {
          this.sprite.width = newWidthBL;
          this.sprite.x = newPosition.x;
        }
        // If new height is greater than or equal to minimum height, update sprite's height
        if (newHeightBL >= minHeight) {
          this.sprite.height = newHeightBL;
        }
        break;
      }

      case "bottom-right": {
        // Calculate new width and height based on the difference between current position and new position
        const newWidthBR = newPosition.x - sprite.x;
        const newHeightBR = newPosition.y - sprite.y;

        // If new width is greater than or equal to minimum width, update sprite's width
        if (newWidthBR >= minWidth) {
          this.sprite.width = newWidthBR;
        }
        // If new height is greater than or equal to minimum height, update sprite's height
        if (newHeightBR >= minHeight) {
          this.sprite.height = newHeightBR;
        }
        break;
      }

      default:
        break;
    }
  }
}
