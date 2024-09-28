import { Sprite } from "pixi.js";
import { RESIZE_AREA_CORNER } from "../utils/constants";

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
    this.interactive = true;
    this.buttonMode = true;

    // Initial global states for the sprite, prevents interaction conflicts
    this.cursor = "pointer";
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
      const bounds = this.getBounds();
      const localPosition = event.data.getLocalPosition(this.parent);

      // Check corners for resizing
      if (
        Math.abs(localPosition.x - bounds.x) < RESIZE_AREA_CORNER &&
        Math.abs(localPosition.y - bounds.y) < RESIZE_AREA_CORNER
      ) {
        this.activeCorner = "top-left";
        this.cursor = "nwse-resize";
      } else if (
        Math.abs(localPosition.x - (bounds.x + bounds.width)) <
          RESIZE_AREA_CORNER &&
        Math.abs(localPosition.y - bounds.y) < RESIZE_AREA_CORNER
      ) {
        this.activeCorner = "top-right";
        this.cursor = "nesw-resize";
      } else if (
        Math.abs(localPosition.x - bounds.x) < RESIZE_AREA_CORNER &&
        Math.abs(localPosition.y - (bounds.y + bounds.height)) <
          RESIZE_AREA_CORNER
      ) {
        this.activeCorner = "bottom-left";
        this.cursor = "nesw-resize";
      } else if (
        Math.abs(localPosition.x - (bounds.x + bounds.width)) <
          RESIZE_AREA_CORNER &&
        Math.abs(localPosition.y - (bounds.y + bounds.height)) <
          RESIZE_AREA_CORNER
      ) {
        this.activeCorner = "bottom-right";
        this.cursor = "nwse-resize";
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
        const newPosition = event.data.getLocalPosition(this.parent);
        this.resizeSprite(newPosition, this.activeCorner);

        if (this.options.onResizeMove) {
          this.options.onResizeMove(this, event);
        }
      }
    };

    this.onResizeEnd = (event) => {
      if (this._resizing) {
        this._resizing = false;
        this.activeCorner = null;
        this.cursor = "pointer";

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

  resizeSprite(newPosition, corner) {
    const minWidth = this.options.minWidth || RESIZE_AREA_MIN;
    const minHeight = this.options.minHeight || RESIZE_AREA_MIN;

    // Resize logic based on active corner
    switch (corner) {
      case "top-left":
        // Similar resizing logic as before
        break;
      // Handle other corners...
    }
  }
}
