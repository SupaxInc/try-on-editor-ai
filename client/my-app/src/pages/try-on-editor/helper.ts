import { Texture, Sprite, Application } from "pixi.js";

export const createSpriteFromFile = (
  file: File,
  callback: (sprite: Sprite) => void
): void => {
  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const img = new Image();
    img.src = e.target?.result as string;
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
export const getBase64FromSprite = async (
  sprite: Sprite,
  pixiApp: Application
): Promise<string> => {
  return new Promise((resolve) => {
    // Extract the sprite's visual content as a canvas from the Pixi.js renderer
    // This is used to convert the sprite into a format that can be easily transformed into a base64 string
    const spriteCanvas = pixiApp.renderer.extract.canvas(sprite);

    // Convert the canvas content to a PNG image and remove the MIME type prefix
    if (spriteCanvas instanceof HTMLCanvasElement) {
      const dataUrl = spriteCanvas.toDataURL("image/png");
      resolve(dataUrl.split(",")[1]);
    } else {
      console.error("spriteCanvas is not a valid HTMLCanvasElement");
      resolve("");
    }
  });
};
