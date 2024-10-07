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
  // **Getter function so that the target sprite can be dynamically retrieved and reference is no longer stale if it changes**
  targetSpriteGetter?: () => AllSetupSprites | null;
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
