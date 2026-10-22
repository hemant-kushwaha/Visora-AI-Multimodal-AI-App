# Visora AI — Multimodal AI Chatbot

Visora AI is a web-based multimodal AI chatbot powered by Google's Gemini API. It provides a responsive chat interface with real-time streamed responses and supports text prompts, image analysis, PDF document understanding, and optional web search.

## Features

- **AI-Powered Chat:** Ask questions and receive responses powered by Gemini.
- **Streaming Responses:** Display generated text progressively instead of waiting for the complete response.
- **Image Analysis:** Upload images and ask questions about their contents.
- **PDF Understanding:** Upload PDF documents for summarization and question answering.
- **Web Search:** Optionally enable web search for queries that need external information.
- **Conversation Context:** Maintain context across follow-up messages using Gemini interaction IDs.
- **File Validation:** Enforce file type and size restrictions on the client and server.
- **Responsive UI:** Clean chat interface with automatic scrolling, attachment controls, and a new-chat option.

## Tech Stack

**Frontend**

- HTML5
- CSS3
- Vanilla JavaScript

**Backend**

- Node.js
- Express.js
- Multer

**AI Integration**

- Google Gemini API
- `@google/genai`
- Gemini Interactions API

## Upload Limits

| File type | Maximum size |
| --------- | -----------: |
| Image     |         1 MB |
| PDF       |         2 MB |

Only one file can be uploaded per request. PDF page-count validation is not included.

## Project Structure

```text
visora-ai/
├── public/
│   └── index.html
├── src/
│   ├── server.js
│   ├── ai.js
│   ├── upload.js
│   └── constants.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

- Node.js (version supported by your installed dependencies)
- npm
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

## Installation

**1. Clone the repository**

```bash
git clone <YOUR_REPOSITORY_URL>
cd visora-ai
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root:

```env
PORT=8080
GEMINI_API_KEY=your_gemini_api_key
MODEL=your_supported_gemini_model
```

Replace the placeholders with your actual API key and a model available to your account. Ensure `ai.js` reads the API key using the same environment variable name.

**4. Start the server**

```bash
node src/server.js
```

**5. Open the application**

Visit [http://localhost:8080](http://localhost:8080) in your browser.

## How It Works

1. The user enters a message and optionally attaches an image or PDF.
2. The frontend sends the message and attachment to the Express backend using `FormData`.
3. Multer processes the upload and the backend validates the file.
4. The backend sends the input to Gemini using the configured model.
5. Gemini streams its response to the frontend.
6. The frontend reads the response stream and updates the chat message progressively.
7. When enabled, web search can provide additional information for supported queries.

## API Endpoints

| Method   | Endpoint    | Description                                 |
| -------- | ----------- | ------------------------------------------- |
| `POST`   | `/api/chat` | Sends a message and streams the AI response |
| `DELETE` | `/api/chat` | Clears the current conversation context     |

## Security Notes

- Keep your Gemini API key in `.env`.
- Never commit `.env` or expose your API key in frontend JavaScript.
- Validate uploaded files on the backend, even if the frontend performs validation.
- Use HTTPS and appropriate request limits when deploying publicly.
- Gemini API quotas and rate limits depend on the selected model and your project's usage tier.

## Future Improvements

- PDF page-count validation
- Persistent conversation history
- Markdown rendering and code syntax highlighting
- Better handling of API quota errors and interrupted streams
- Deployment with production-grade error handling

## Author

**Hemant Kushwaha**

Built as a JavaScript and Generative AI project to explore multimodal AI, streaming responses, and Gemini API integration.
