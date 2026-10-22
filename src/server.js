import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import chatBot, { clearHistory } from "./ai.js";
import { uploadFiles, validateUploads } from "./upload.js";

const app = express();

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(currentDirectory, "..");

const PORT = Number(process.env.PORT || 8080);

// Serve the frontend from the project's public folder.
app.use(express.static(path.join(projectDirectory, "public")));

// Send messages, images, and PDFs to the chatbot.
app.post("/api/chat", uploadFiles, validateUploads, chatBot);

// Start a new conversation.
app.delete("/api/chat", (_req, res) => {
  clearHistory();
  res.sendStatus(200);
});

// Handle errors from uploads and other middleware.
app.use((error, _req, res, _next) => {
  if (error instanceof Error && error.code === "LIMIT_FILE_SIZE") {
    return res
      .status(413)
      .type("text")
      .send("File too large. Images: maximum 2 MB. PDFs: maximum 5 MB.");
  }

  if (error.status === 400) {
    return res.status(400).type("text").send(error.message);
  }

  console.error("Server error:", error);

  res.status(500).type("text").send("Something went wrong.");
});

app.listen(PORT, () => {
  console.log(`Visora AI is running at http://localhost:${PORT}`);
});
