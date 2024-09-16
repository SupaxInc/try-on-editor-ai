import axios from "axios";

// TODO: Think of ways to increase performance here, maybe cache avatar/items or save avatar states in the DB
export const triggerTryOn = async (charSprite, itemSprite, pixiApp) => {
  try {
    const charBase64 = await getBase64FromSprite(charSprite, pixiApp);
    const itemBase64 = await getBase64FromSprite(itemSprite, pixiApp);

    const data = {
      avatar: charBase64,
      clothing: itemBase64,
    };

    const response = await axios.post("http://localhost:3001/try-on", data, {
      headers: { "Content-Type": "application/json" },
    });

    console.log(response.data);
  } catch (error) {
    console.error("Error triggering try-on:", error);
  }
};

// Convert a Pixi.js sprite's texture into a base64 string
const getBase64FromSprite = async (sprite, pixiApp) => {
  return new Promise((resolve) => {
    // Extract the sprite's visual content as an image element from the Pixi.js renderer
    // This is used to convert the sprite into a format that can be easily transformed into a base64 string
    const spriteImage = pixiApp.renderer.extract.canvas(sprite);

    // Convert the canvas content to a PNG image and remove the MIME type prefix
    resolve(spriteImage.toDataURL("image/png").split(",")[1]);
  });
};
