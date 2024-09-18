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

// Convert a Pixi.js sprite's texture into a base64 string
export const getBase64FromSprite = async (sprite, pixiApp) => {
  return new Promise((resolve) => {
    // Extract the sprite's visual content as an image element from the Pixi.js renderer
    // This is used to convert the sprite into a format that can be easily transformed into a base64 string
    const spriteImage = pixiApp.renderer.extract.canvas(sprite);

    // Convert the canvas content to a PNG image and remove the MIME type prefix
    resolve(spriteImage.toDataURL("image/png").split(",")[1]);
  });
};
