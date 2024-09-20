import axios from "axios";
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
    console.log(response.data);

    return pollJobResult(jobId);
  } catch (error) {
    console.error("Error triggering try-on:", error);
  }
};

const pollJobResult = async (jobId) => {
  const maxAttempts = 30;
  const pollInterval = 2000; // 2 seconds x 30 = 60 seconds max of polling

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
