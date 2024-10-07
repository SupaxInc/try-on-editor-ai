import { Sprite, Container } from "pixi.js";

// Custom type for for item sprite that has been setup
export type ItemSprite = Sprite & {
  initialX: number;
  initialY: number;
  label: string;
};

// Custom type for for character sprite that has been setup
export type CharacterSprite = Sprite & {
  label: string;
};

export type AllSetupSprites = ItemSprite | CharacterSprite;

export type NamedContainer = Container & {
  label: string;
};
