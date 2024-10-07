import axios from "axios";
import { Sprite, Texture } from "pixi.js";
import { getBase64FromSprite } from "./pages/try-on-editor/helper";

const API_BASE_URL = "http://localhost:3001";

// TODO: Think of ways to increase performance here, maybe cache avatar/items or save avatar states in the DB
export const triggerTryOn = async (charSprite, itemSprite, pixiApp) => {
  try {
    // Force the renderer to update
    pixiApp.renderer.render(pixiApp.stage);

    // Wait for the next animation frame to ensure rendering is complete
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const charBase64 = await getBase64FromSprite(charSprite, pixiApp);
    const itemBase64 = await getBase64FromSprite(itemSprite, pixiApp);

    const data = {
      avatar: charBase64,
      clothing: itemBase64,
    };

    const response = await axios.post(`${API_BASE_URL}/try-on`, data, {
      headers: { "Content-Type": "application/json" },
    });

    const { jobId } = response.data;

    const newCharBase64 = await pollJobResult(jobId);

    // Create an Image object from the base64 string
    const img = new Image();
    img.src = `data:image/jpeg;base64,${newCharBase64}`;

    //document.body.appendChild(img); // Append the image to the body for testing

    // Wait for the image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = (e) => {
        console.error("Image failed to load:", e);
        reject(e);
      };
    });

    // Create a Texture from the Image
    const newCharTexture = Texture.from(img);

    // Create a Sprite from the Texture
    const newCharSprite = new Sprite(newCharTexture);
    newCharSprite.anchor.set(0.5);

    return newCharSprite;
  } catch (error) {
    console.error("Error triggering try-on:", error);
    throw error;
  }
};

// TODO: Maybe change this to a websocket/sse/long polling or just buy a better GPU lol
const pollJobResult = async (jobId) => {
  const maxAttempts = 90;
  const pollInterval = 2000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await axios.get(`${API_BASE_URL}/job/${jobId}`);
      const { status, result } = response.data;

      if (status === "completed") {
        console.log("Got result during polling. Success!");
        return result;
      }

      // If job is still pending, wait before next poll
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    } catch (error) {
      console.error("Error polling job result:", error);
      throw error;
    }
  }

  throw new Error("Job polling timed out");
};
