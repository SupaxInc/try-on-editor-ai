import {
  Sprite,
  Point,
  Container,
  Bounds,
  FederatedPointerEvent,
  Application,
} from "pixi.js";
import { RESIZE_AREA_CORNER, RESIZE_AREA_MIN } from "../../utils/constants";
import { InteractiveSpriteOptions, ResizeCorner } from "./types";
import { AllSetupSprites, NamedContainer } from "../../types";
import { isItemSprite } from "../../utils/helper";
import { showLoadingCircleSpinner } from "../../utils/animations";

// TODO: ADD A LOADING STATE TO THE INTERACTIVE SPRITE
export default class InteractiveSprite {
  private sprite: AllSetupSprites;
  private container: NamedContainer;
  private app: Application;
  private options: InteractiveSpriteOptions;

  // Initial states of the sprite, used to check for conflicts during interactions
  private isDragging: boolean = false;
  private isResizing: boolean = false;
  private isLoading: boolean = false;
  private activeCorner: ResizeCorner = null;

  // Animation states of the sprite
  private loadingSpinnerContainer: Container | null = null;

  constructor(
    container: NamedContainer,
    sprite: AllSetupSprites,
    app: Application,
    options: InteractiveSpriteOptions = {}
  ) {
    this.container = container;
    this.sprite = sprite;
    this.app = app;

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
    this.activeCorner = null;
    this.isDragging = false;
    this.isResizing = false;

    if (this.options.draggable) {
      this.sprite.cursor = "pointer";
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

  public setNewSprite(sprite: AllSetupSprites): void {
    this.sprite = sprite;
    this.initialize();
  }

  public getContainer(): NamedContainer {
    return this.container;
  }

  public setLoading(loading: boolean): void {
    if (loading) {
      this.isLoading = true;
      this.loadingSpinnerContainer = showLoadingCircleSpinner(
        this.sprite,
        this.app,
        this.container
      );
      this.sprite.alpha = 0.5;
      this.sprite.cursor = "wait";
    } else {
      this.isLoading = false;
      this.loadingSpinnerContainer?.destroy();
      this.sprite.alpha = 1;
      this.sprite.cursor = "pointer";
    }
  }

  private enableDragging(): void {
    let pointerOffsetX: number;
    let pointerOffsetY: number;

    const onDragStart = (event: FederatedPointerEvent): void => {
      if (this.isResizing || this.isLoading) return;

      const parent = this.container;
      const localPosition = event.getLocalPosition(parent);

      pointerOffsetX = localPosition.x - this.sprite.x;
      pointerOffsetY = localPosition.y - this.sprite.y;

      this.isDragging = true;
      this.sprite.alpha = 0.5;
      this.sprite.cursor = "grabbing";
    };

    const onDragMove = (event: FederatedPointerEvent): void => {
      if (this.isDragging) {
        const parent = this.container;
        const newPosition = event.getLocalPosition(parent);

        this.sprite.x = newPosition.x - pointerOffsetX;
        this.sprite.y = newPosition.y - pointerOffsetY;
      }
    };

    const onDragEnd = (event: FederatedPointerEvent): void => {
      if (this.isDragging) {
        this.isDragging = false;
        this.sprite.alpha = 1;
        this.sprite.cursor = "pointer";

        if (this.options.onDropResetToInitial && isItemSprite(this.sprite)) {
          this.options.onDropResetToInitial?.(this.sprite);
        }
      }
    };

    this.sprite.on("pointerdown", onDragStart);
    this.sprite.on("pointermove", onDragMove);
    this.sprite.on("pointerup", onDragEnd);
    this.sprite.on("pointerupoutside", onDragEnd);
  }

  // TODO: Fix resizing, cursor not changing and its resizing too big
  private enableResizing(): void {
    const onResizeStart = (event: FederatedPointerEvent): void => {
      if (this.isLoading) return;

      const bounds: Bounds = this.sprite.getBounds();
      const parent = this.container;
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
      }
    };

    const onResizeMove = (event: FederatedPointerEvent): void => {
      if (this.isResizing) {
        const parent = this.container;
        const newPosition = event.getLocalPosition(parent);
        this.resizeSprite(newPosition, this.activeCorner);
      }
    };

    const onResizeEnd = (event: FederatedPointerEvent): void => {
      if (this.isResizing) {
        this.isResizing = false;
        this.activeCorner = null;
        this.sprite.cursor = "pointer";
      }
    };

    this.sprite.on("pointerdown", onResizeStart);
    this.sprite.on("pointermove", onResizeMove);
    this.sprite.on("pointerup", onResizeEnd);
    this.sprite.on("pointerupoutside", onResizeEnd);
  }

  private enableDropping(): void {
    const onDrop = (event: FederatedPointerEvent): void => {
      const globalPosition = event.global;
      if (this.options.isOnTopOfSprite && this.options.targetSpriteGetter) {
        const targetSprite = this.options.targetSpriteGetter();

        if (this.options.isOnTopOfSprite(targetSprite, globalPosition)) {
          this.options.onDropOnSprite?.(this.sprite, this.app);
        }
      }
    };

    this.sprite.on("pointerup", onDrop);
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
