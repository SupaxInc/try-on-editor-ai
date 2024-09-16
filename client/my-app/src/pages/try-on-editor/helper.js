import { Texture, Sprite } from "pixi.js";

export const createSpriteFromFile = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      const texture = Texture.from(img);
      const sprite = new Sprite(texture);
      sprite.anchor.set(0.5);
      callback(sprite);
    };
  };
  reader.readAsDataURL(file);
};
