import axios from "axios";
import { Buffer, Sprite, Texture } from "pixi.js";
import { getBase64FromSprite } from "./pages/try-on-editor/helper";

const API_BASE_URL = "http://localhost:3001";

// TODO: Think of ways to increase performance here, maybe cache avatar/items or save avatar states in the DB
export const triggerTryOn = async (charSprite, itemSprite, pixiApp) => {
  try {
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
    // Decode base64 string to binary buffer
    const binaryString = atob(newCharBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create an Image object to determine the actual dimensions
    const img = new Image();
    img.src = `data:image/jpeg;base64,${newCharBase64}`;

    // Wait for the image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // Create a BufferSource from the buffer with the correct dimensions
    const bufferSource = new Buffer({
      data: bytes,
      width: img.width,
      height: img.height,
    });

    // Create a Texture from the BufferSource
    const newCharTexture = new Texture(bufferSource);

    // Create a Sprite from the Texture
    const newCharSprite = new Sprite(newCharTexture);
    newCharSprite.anchor.set(0.5);

    // Log the new sprite
    console.log("newCharSprite", newCharSprite);

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
