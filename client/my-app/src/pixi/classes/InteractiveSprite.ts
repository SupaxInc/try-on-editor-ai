import {
  Sprite,
  Point,
  Container,
  Bounds,
  FederatedPointerEvent,
} from "pixi.js";
import { RESIZE_AREA_CORNER, RESIZE_AREA_MIN } from "../utils/constants";
import { InteractiveSpriteOptions, ResizeCorner } from "./types";

export default class InteractiveSprite {
  private sprite: Sprite;
  private options: InteractiveSpriteOptions;
  private isDragging: boolean = false;
  private isResizing: boolean = false;
  private activeCorner: ResizeCorner = null;

  private onDragStart?: (event: FederatedPointerEvent) => void;
  private onDragMove?: (event: FederatedPointerEvent) => void;
  private onDragEnd?: (event: FederatedPointerEvent) => void;
  private onResizeStart?: (event: FederatedPointerEvent) => void;
  private onResizeMove?: (event: FederatedPointerEvent) => void;
  private onResizeEnd?: (event: FederatedPointerEvent) => void;
  private onDrop?: (event: FederatedPointerEvent) => void;

  constructor(sprite: Sprite, options: InteractiveSpriteOptions = {}) {
    this.sprite = sprite;
    this.options = {
      draggable: true,
      resizable: true,
      droppable: false,
      ...options,
    };

    this.initialize();
  }

  private initialize(): void {
    this.sprite.interactive = true;

    this.sprite.cursor = "pointer";
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
  }

  public getSprite(): Sprite {
    return this.sprite;
  }

  private enableDragging(): void {
    let pointerOffsetX: number;
    let pointerOffsetY: number;

    this.onDragStart = (event: FederatedPointerEvent): void => {
      if (this.isResizing) return;

      const parent = this.sprite.parent as Container;
      const localPosition = event.getLocalPosition(parent);

      pointerOffsetX = localPosition.x - this.sprite.x;
      pointerOffsetY = localPosition.y - this.sprite.y;

      this.isDragging = true;
      this.sprite.alpha = 0.5;
      this.sprite.cursor = "grabbing";

      this.options.onDragStart?.(this, event);

      event.stopPropagation();
    };

    this.onDragMove = (event: FederatedPointerEvent): void => {
      if (this.isDragging) {
        const parent = this.sprite.parent as Container;
        const newPosition = event.getLocalPosition(parent);

        this.sprite.x = newPosition.x - pointerOffsetX;
        this.sprite.y = newPosition.y - pointerOffsetY;

        this.options.onDragMove?.(this, event);
      }
    };

    this.onDragEnd = (event: FederatedPointerEvent): void => {
      if (this.isDragging) {
        this.isDragging = false;
        this.sprite.alpha = 1;
        this.sprite.cursor = "pointer";

        this.options.onDragEnd?.(this, event);
      }
    };

    this.sprite.on("pointerdown", this.onDragStart);
    this.sprite.on("pointermove", this.onDragMove);
    this.sprite.on("pointerup", this.onDragEnd);
    this.sprite.on("pointerupoutside", this.onDragEnd);
  }

  private enableResizing(): void {
    this.onResizeStart = (event: FederatedPointerEvent): void => {
      const bounds: Bounds = this.sprite.getBounds();
      const parent = this.sprite.parent as Container;
      const localPosition = event.getLocalPosition(parent);

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
        this.isResizing = true;
        this.options.onResizeStart?.(this, event);

        event.stopPropagation();
      }
    };

    this.onResizeMove = (event: FederatedPointerEvent): void => {
      if (this.isResizing) {
        const parent = this.sprite.parent as Container;
        const newPosition = event.getLocalPosition(parent);
        this.resizeSprite(newPosition, this.activeCorner);

        this.options.onResizeMove?.(this, event);
      }
    };

    this.onResizeEnd = (event: FederatedPointerEvent): void => {
      if (this.isResizing) {
        this.isResizing = false;
        this.activeCorner = null;
        this.sprite.cursor = "pointer";

        this.options.onResizeEnd?.(this, event);
      }
    };

    this.sprite.on("pointerdown", this.onResizeStart);
    this.sprite.on("pointermove", this.onResizeMove);
    this.sprite.on("pointerup", this.onResizeEnd);
    this.sprite.on("pointerupoutside", this.onResizeEnd);
  }

  private enableDropping(): void {
    this.onDrop = (event: FederatedPointerEvent): void => {
      const globalPosition = event.global;

      if (this.options.isOnTopOfSprite && this.options.targetSprite) {
        if (
          this.options.isOnTopOfSprite(
            this.options.targetSprite,
            globalPosition
          )
        ) {
          this.options.onDropOnSprite?.(this, this.options.targetSprite, event);
        }
      }
    };

    this.sprite.on("pointerup", this.onDrop);
  }

  /**
   * Resizes the sprite based on the new pointer position and the active corner being dragged.
   * @param newPosition - The new position of the pointer
   * @param corner - The corner of the sprite being dragged for resizing
   */
  private resizeSprite(newPosition: Point, corner: ResizeCorner): void {
    const minWidth = RESIZE_AREA_MIN;
    const minHeight = RESIZE_AREA_MIN;

    switch (corner) {
      case "top-left": {
        // Calculate new dimensions
        const newWidth = this.sprite.width + (this.sprite.x - newPosition.x);
        const newHeight = this.sprite.height + (this.sprite.y - newPosition.y);

        // Update width and x-position if above minimum width
        if (newWidth >= minWidth) {
          this.sprite.width = newWidth;
          this.sprite.x = newPosition.x;
        }
        // Update height and y-position if above minimum height
        if (newHeight >= minHeight) {
          this.sprite.height = newHeight;
          this.sprite.y = newPosition.y;
        }
        break;
      }

      case "top-right": {
        // Calculate new dimensions
        const newWidth = newPosition.x - this.sprite.x;
        const newHeight = this.sprite.height + (this.sprite.y - newPosition.y);

        // Update width if above minimum (x-position stays the same)
        if (newWidth >= minWidth) {
          this.sprite.width = newWidth;
        }
        // Update height and y-position if above minimum height
        if (newHeight >= minHeight) {
          this.sprite.height = newHeight;
          this.sprite.y = newPosition.y;
        }
        break;
      }

      case "bottom-left": {
        // Calculate new dimensions
        const newWidth = this.sprite.width + (this.sprite.x - newPosition.x);
        const newHeight = newPosition.y - this.sprite.y;

        // Update width and x-position if above minimum width
        if (newWidth >= minWidth) {
          this.sprite.width = newWidth;
          this.sprite.x = newPosition.x;
        }
        // Update height if above minimum (y-position stays the same)
        if (newHeight >= minHeight) {
          this.sprite.height = newHeight;
        }
        break;
      }

      case "bottom-right": {
        // Calculate new dimensions
        const newWidth = newPosition.x - this.sprite.x;
        const newHeight = newPosition.y - this.sprite.y;

        // Update width if above minimum (x-position stays the same)
        if (newWidth >= minWidth) {
          this.sprite.width = newWidth;
        }
        // Update height if above minimum (y-position stays the same)
        if (newHeight >= minHeight) {
          this.sprite.height = newHeight;
        }
        break;
      }

      default:
        break;
    }
  }
}
