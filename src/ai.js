import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./constants.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Remember the previous turn for this single-user demo.
let previousInteractionId = null;

export default async function chatBot(req, res) {
  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";

  const image = req.files?.image?.[0];
  const pdf = req.files?.pdf?.[0];
  const webSearch = req.body?.webSearch === "true";

  if (!message && !image && !pdf) {
    return res
      .status(400)
      .type("text")
      .send("Please enter a message or attach an image or PDF.");
  }

  // Basic PDF signature check.
  if (pdf && !pdf.buffer.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
    return res
      .status(400)
      .type("text")
      .send("The uploaded file does not appear to be a valid PDF.");
  }

  try {
    const prompt =
      message || (image ? "Describe this image." : "Summarize this PDF.");

    // Start with the user's text.
    const input = [{ type: "text", text: prompt }];

    // Add the image if one was uploaded.
    if (image) {
      input.push({
        type: "image",
        data: image.buffer.toString("base64"),
        mime_type: image.mimetype,
      });
    }

    // Add the PDF if one was uploaded.
    if (pdf) {
      input.push({
        type: "document",
        data: pdf.buffer.toString("base64"),
        mime_type: "application/pdf",
      });
    }

    // Configure the Gemini request.
    const options = {
      model: process.env.MODEL || "gemini-3.8-flash",
      system_instruction: SYSTEM_PROMPT,
      input,
      stream: true,
      generation_config: {
        max_output_tokens: 512,
        // thinking_level: "low",
      },
    };

    // Continue the previous conversation when available.
    if (previousInteractionId) {
      options.previous_interaction_id = previousInteractionId;
    }

    // Search the web only when the user enables it.
    if (webSearch) {
      options.tools = [{ type: "google_search" }];
    }

    const stream = await ai.interactions.create(options);

    // Stream the answer to the frontend.
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");

    for await (const event of stream) {
      if (event.event_type === "step.delta" && event.delta?.type === "text") {
        res.write(event.delta.text);
      }

      // Save the interaction ID for the next message.
      if (event.event_type === "interaction.completed") {
        previousInteractionId = event.interaction.id;
      }
    }

    res.end();
  } catch (error) {
    console.error("Gemini error:", error);

    if (!res.headersSent) {
      return res
        .status(502)
        .type("text")
        .send(
          "Unable to get an AI response. Check your API key, model, and quota.",
        );
    }

    res.end();
  }
}

// Reset conversation history.
export function clearHistory() {
  previousInteractionId = null;
}
