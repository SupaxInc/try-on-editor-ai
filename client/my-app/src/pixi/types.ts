import { Sprite, Container } from "pixi.js";

// Custom type for for sprite that has been setup
export type ItemSprite = Sprite & {
  initialX: number;
  initialY: number;
  label: string;
};

export type NamedContainer = Container & {
  label: string;
};
