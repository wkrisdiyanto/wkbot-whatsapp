import { makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import Replicate from "replicate";
import OpenAI from "openai";
import axios from "axios";
import sharp from "sharp";
import dotenv from "dotenv";
import fs from "fs/promises";
import googleTTS from "google-tts-api";
import ytdl from "ytdl-core";
import translate from "google-translate-api";
import ffmpeg from "fluent-ffmpeg";

dotenv.config();

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function convertAudio(buffer) {
    const inputPath = "audio.ogg";
    const outputPath = "audio.wav";
    await fs.writeFile(inputPath, buffer);
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath).toFormat("wav").on("end", () => resolve(outputPath)).on("error", reject).save(outputPath);
    });
}

async function transcribeAudio(buffer) {
    const audioPath = await convertAudio(buffer);
    const response = await openai.audio.transcriptions.create({ model: "whisper-1", file: fs.createReadStream(audioPath) });
    return response.text;
}

async function textToSpeech(text) {
    return googleTTS.getAudioUrl(text, { lang: "en", slow: false });
}

async function downloadYouTube(url, type = "video") {
    return ytdl(url, { filter: type === "audio" ? "audioonly" : "video" });
}

async function translateText(text, targetLang) {
    const { text: translated } = await translate(text, { to: targetLang });
    return translated;
}

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const sock = makeWASocket({ auth: state, printQRInTerminal: true });
    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || !msg.key.remoteJid) return;
        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (text?.startsWith("!generate ")) {
            const prompt = text.replace("!generate ", "").trim();
            const outputs = await replicate.run("google/imagen-3", { input: { prompt } });
            for (const url of outputs) {
                await sock.sendMessage(sender, { image: { url }, caption: `Generated image for: "${prompt}"` });
            }
        } else if (text?.startsWith("!chat ")) {
            const prompt = text.replace("!chat ", "").trim();
            const reply = await openai.chat.completions.create({ model: "gpt-4", messages: [{ role: "user", content: prompt }] });
            await sock.sendMessage(sender, { text: reply.choices[0].message.content });
        } else if (text?.startsWith("!speak ")) {
            const phrase = text.replace("!speak ", "").trim();
            const audioUrl = await textToSpeech(phrase);
            await sock.sendMessage(sender, { audio: { url: audioUrl }, mimetype: "audio/mp4" });
        } else if (text?.startsWith("!yt ")) {
            const url = text.replace("!yt ", "").trim();
            const stream = await downloadYouTube(url, "video");
            await sock.sendMessage(sender, { video: { stream }, caption: "Here’s your YouTube video!" });
        }
    });
}

connectToWhatsApp();