import { Application, FederatedPointerEvent, Point, Sprite } from "pixi.js";
import {
  isOnTopOfSprite,
  onDropResetToInitial,
} from "../../utils/interactions";
import { AllSetupSprites } from "../../types";

export interface InteractiveSpriteOptions {
  draggable?: boolean;
  resizable?: boolean;
  droppable?: boolean;
  isOnTopOfSprite?: typeof isOnTopOfSprite;
  targetSprite?: AllSetupSprites;
  onDropOnSprite?: (
    sprite: AllSetupSprites,
    app: Application
  ) => Promise<Sprite | null>;
  onDropResetToInitial?: typeof onDropResetToInitial;
}

export type ResizeCorner =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | null;
