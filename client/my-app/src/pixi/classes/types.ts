import { FederatedPointerEvent, Point, Sprite } from "pixi.js";
import InteractiveSprite from "./InteractiveSprite";

export interface InteractiveSpriteOptions {
  draggable?: boolean;
  resizable?: boolean;
  droppable?: boolean;
  onDragStart?: (
    sprite: InteractiveSprite,
    event: FederatedPointerEvent
  ) => void;
  onDragMove?: (
    sprite: InteractiveSprite,
    event: FederatedPointerEvent
  ) => void;
  onDragEnd?: (sprite: InteractiveSprite, event: FederatedPointerEvent) => void;
  onResizeStart?: (
    sprite: InteractiveSprite,
    event: FederatedPointerEvent
  ) => void;
  onResizeMove?: (
    sprite: InteractiveSprite,
    event: FederatedPointerEvent
  ) => void;
  onResizeEnd?: (
    sprite: InteractiveSprite,
    event: FederatedPointerEvent
  ) => void;
  isOnTopOfSprite?: (targetSprite: Sprite, globalPosition: Point) => boolean;
  targetSprite?: Sprite;
  onDropOnSprite?: (
    sprite: InteractiveSprite,
    targetSprite: Sprite,
    event: FederatedPointerEvent
  ) => void;
}

export type ResizeCorner =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | null;
