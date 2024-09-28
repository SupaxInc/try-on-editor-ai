import { FederatedPointerEvent, Point, Sprite } from "pixi.js";
import InteractiveSprite from "./InteractiveSprite";

export interface InteractiveSpriteOptions {
  draggable?: boolean;
  resizable?: boolean;
  droppable?: boolean;
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
