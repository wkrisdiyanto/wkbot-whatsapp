# WhatsApp Bot with Baileys, OpenAI, and Replicate

## 📌 Features
- WhatsApp bot using `@whiskeysockets/baileys`
- AI-powered chatbot with OpenAI GPT-4
- Image generation using Google Imagen-3 (Replicate API)
- YouTube video/audio downloader
- Text-to-speech (Google TTS)
- Background removal (Remove.bg API - optional)
- Translation (Google Translate API)
- Voice-to-text using Whisper AI

## 📋 Requirements
- Node.js (v16+ recommended)
- FFmpeg (for audio processing)
- A WhatsApp account
- API keys for:
  - OpenAI (`OPENAI_API_KEY`)
  - Replicate (`REPLICATE_API_TOKEN`)
  - Remove.bg (`REMOVE_BG_API_KEY`, optional)

## 🚀 Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/whatsapp-bot.git
cd whatsapp-bot
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the project root and add:
```env
OPENAI_API_KEY=your_openai_api_key
REPLICATE_API_TOKEN=your_replicate_api_key
REMOVE_BG_API_KEY=your_remove_bg_api_key (optional)
```

### 4️⃣ Install FFmpeg (Required for Audio Processing)
#### Windows:
Download and install FFmpeg from [FFmpeg.org](https://ffmpeg.org/download.html), then add it to your system PATH.
#### Linux (Debian/Ubuntu):
```sh
sudo apt update && sudo apt install ffmpeg -y
```
#### macOS (using Homebrew):
```sh
brew install ffmpeg
```

## ▶️ Running the Bot
```sh
node bot.js
```
Scan the QR code with your WhatsApp to authenticate.

## 📜 Commands
| Command        | Description                                  |
|---------------|----------------------------------------------|
| `!generate <text>` | Generate an image using Google Imagen-3  |
| `!chat <text>` | Chat with OpenAI GPT-4                     |
| `!speak <text>` | Convert text to speech (Google TTS)       |
| `!yt <url>` | Download YouTube video/audio               |
| `!translate <text> <lang>` | Translate text using Google Translate |

## 📌 Notes
- Ensure your API keys are valid.
- Keep your WhatsApp session active to maintain connection.

## 📄 License
This project is open-source under the MIT License.

