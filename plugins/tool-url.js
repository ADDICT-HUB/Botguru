const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { malvin } = require("../malvin");

// API keys — replace with your own
const API_KEYS = [
  "40dfb24c7b48ba51487a9645abf33148",
  "4a9c3527b0cd8b12dd4d8ab166a0f592",
  "0e2b3697320c339de00589478be70c48",
  "7b46d3cddc9b67ef690ed03dce9cb7d5"
];

malvin({
  pattern: "tourl",
  alias: ["imgtourl", "imgurl", "url", "uploadimg"],
  react: "🔄",
  desc: "Convert an image to a URL using ImgBB.",
  category: "utility",
  use: ".tourl (reply to an image)",
  filename: __filename
}, async (malvin, mek, m, { reply }) => {
  try {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted).mimetype || "";

    if (!mime.startsWith("image")) {
      return reply("*[❗] Oops! Reply to an image*");
    }

    const buffer = await quoted.download();
    const filePath = path.join(os.tmpdir(), "vision-v.jpg");
    fs.writeFileSync(filePath, buffer);

    let imageUrl, lastError;
    for (const apiKey of API_KEYS) {
      try {
        const form = new FormData();
        form.append("image", fs.createReadStream(filePath));

        const res = await axios.post("https://api.imgbb.com/1/upload", form, {
          params: { key: apiKey },
          headers: form.getHeaders()
        });

        imageUrl = res?.data?.data?.url;
        if (!imageUrl) throw new Error("No URL returned");
        break;
      } catch (err) {
        lastError = err;
        console.error(`ImgBB key failed [${apiKey}]:`, err.message);
      }
    }

    fs.unlinkSync(filePath);

    if (!imageUrl) throw lastError;

    reply(
      `\`✅ IMAGE UPLOADED SUCCESSFULLY!\`\n\n` +
      `📂 *File Size:* ${buffer.length} bytes\n` +
      `🔗 *URL:* ${imageUrl}\n\n` +
      `> ᴍᴀᴅᴇ ʙʏ ᴍᴀʀɪsᴇʟ`
    );
  } catch (e) {
    console.error("tourl error:", e);
    reply(`❌ Error: ${e.message || e}`);
  }
});


malvin({
  pattern: "tourl2",
  alias: ["imgtourl2", "imgurl2", "url2", "geturl2", "upload"],
  react: "📤",
  desc: "Upload media to Catbox and return a direct URL.",
  category: "utility",
  use: ".tourl2 (reply to media)",
  filename: __filename
}, async (client, m, args, { reply }) => {
  try {
    const q = m.quoted || m;
    const mime = (q.msg || q).mimetype || "";
    if (!mime) throw "❌ Reply to image, audio or video.";

    const buffer = await q.download();
    const ext = mime.includes("image/jpeg") ? ".jpg" :
                mime.includes("png") ? ".png" :
                mime.includes("video") ? ".mp4" :
                mime.includes("audio") ? ".mp3" : "";
    const name = `file${ext}`;
    const tmp = path.join(os.tmpdir(), `catbox_${Date.now()}${ext}`);
    fs.writeFileSync(tmp, buffer);

    const form = new FormData();
    form.append("fileToUpload", fs.createReadStream(tmp), name);
    form.append("reqtype", "fileupload");

    const res = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    if (!res.data) throw "Upload failed.";

    fs.unlinkSync(tmp);

    const type = mime.includes("image") ? "Image" :
                 mime.includes("video") ? "Video" :
                 mime.includes("audio") ? "Audio" : "File";

    reply(
      `*✅ ${type} Uploaded!*\n\n` +
      `📁 *Size:* ${formatBytes(buffer.length)}\n` +
      `🔗 *URL:* ${res.data}\n\n` +
      `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀʟᴠɪɴ-xᴅ`
    );
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { malvin } = require("../malvin");

// API keys — replace with your own
const API_KEYS = [
  "40dfb24c7b48ba51487a9645abf33148",
  "4a9c3527b0cd8b12dd4d8ab166a0f592",
  "0e2b3697320c339de00589478be70c48",
  "7b46d3cddc9b67ef690ed03dce9cb7d5"
];

// === New helpers ===
let lastGoodKeyIndex = 0; // remember last working key for faster upload

function fileIcon(mime) {
  if (/image/.test(mime)) return "🖼️";
  if (/video/.test(mime)) return "🎥";
  if (/audio/.test(mime)) return "🎧";
  if (/pdf/.test(mime)) return "📄";
  return "📁";
}

function formatBytes(bytes) {
  if (!bytes) return "0 Bytes";
  const k = 1024, sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// Smart ImgBB uploader
async function uploadToImgBB(filePath) {
  let imageUrl, lastError;
  for (let i = 0; i < API_KEYS.length; i++) {
    const apiKey = API_KEYS[(lastGoodKeyIndex + i) % API_KEYS.length];
    try {
      const form = new FormData();
      form.append("image", fs.createReadStream(filePath));
      const res = await axios.post("https://api.imgbb.com/1/upload", form, {
        params: { key: apiKey },
        headers: form.getHeaders(),
        timeout: 15000
      });
      imageUrl = res?.data?.data?.url;
      if (!imageUrl) throw new Error("No URL returned");
      lastGoodKeyIndex = (lastGoodKeyIndex + i) % API_KEYS.length;
      break;
    } catch (err) {
      lastError = err;
      console.error(`ImgBB key failed [${apiKey}]:`, err.message);
    }
  }
  if (!imageUrl) throw lastError;
  return imageUrl;
}

// =================== COMMANDS ===================

malvin({
  pattern: "tourl",
  alias: ["imgtourl", "imgurl", "url", "uploadimg"],
  react: "🔄",
  desc: "Convert an image to a URL using ImgBB.",
  category: "utility",
  use: ".tourl (reply to an image)",
  filename: __filename
}, async (malvin, mek, m, { reply }) => {
  try {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted).mimetype || "";

    if (!mime.startsWith("image")) {
      return reply("*[❗] Oops! Reply to an image*");
    }

    const buffer = await quoted.download();
    if (buffer.length > 10 * 1024 * 1024) return reply("⚠️ File too large (max 10 MB).");

    const filePath = path.join(os.tmpdir(), "vision-v.jpg");
    fs.writeFileSync(filePath, buffer);

    await reply("⏳ Uploading to ImgBB…");

    const imageUrl = await uploadToImgBB(filePath);
    fs.unlinkSync(filePath);

    reply(
      `✅ ${fileIcon(mime)} *Image Uploaded!*\n\n` +
      `📂 *Size:* ${formatBytes(buffer.length)}\n` +
      `🔗 *URL:* ${imageUrl}\n\n` +
      `> ᴍᴀᴅᴇ ʙʏ ᴍᴀʀɪsᴇʟ`
    );
  } catch (e) {
    console.error("tourl error:", e);
    reply(`❌ Upload failed. ${e.message || e}`);
  }
});

malvin({
  pattern: "tourl2",
  alias: ["imgtourl2", "imgurl2", "url2", "geturl2", "upload"],
  react: "📤",
  desc: "Upload media to Catbox and return a direct URL.",
  category: "utility",
  use: ".tourl2 (reply to media)",
  filename: __filename
}, async (client, m, args, { reply }) => {
  try {
    const q = m.quoted || m;
    const mime = (q.msg || q).mimetype || "";
    if (!mime) throw "❌ Reply to image, audio or video.";

    const buffer = await q.download();
    if (buffer.length > 10 * 1024 * 1024) return reply("⚠️ File too large (max 10 MB).");

    const ext = mime.includes("image/jpeg") ? ".jpg" :
                mime.includes("png") ? ".png" :
                mime.includes("video") ? ".mp4" :
                mime.includes("audio") ? ".mp3" : "";
    const name = `file${ext}`;
    const tmp = path.join(os.tmpdir(), `catbox_${Date.now()}${ext}`);
    fs.writeFileSync(tmp, buffer);

    await reply("⏳ Uploading to Catbox…");

    const form = new FormData();
    form.append("fileToUpload", fs.createReadStream(tmp), name);
    form.append("reqtype", "fileupload");

    const res = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
      timeout: 20000
    });

    if (!res.data) throw "Upload failed.";

    fs.unlinkSync(tmp);

    const type = mime.includes("image") ? "Image" :
                 mime.includes("video") ? "Video" :
                 mime.includes("audio") ? "Audio" : "File";

    reply(
      `✅ ${fileIcon(mime)} *${type} Uploaded!*\n\n` +
      `📁 *Size:* ${formatBytes(buffer.length)}\n` +
      `🔗 *URL:* ${res.data}\n\n` +
      `> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀʟᴠɪɴ-xᴅ`
    );
  } catch (e) {
    console.error("tourl2 error:", e);
    reply(`❌ ${e.message || e}`);
  }
});

malvin({
  pattern: "docanalyze",
  alias: ["analyzedoc", "docai", "askdoc"],
  react: "📄",
  desc: "Upload document and ask AI about its contents.",
  category: "utility",
  use: ".docanalyze [your question] [reply to doc]",
  filename: __filename
}, async (client, m, args, { reply }) => {
  try {
    const q = m.quoted || m;
    const mime = (q.msg || q).mimetype || "";
    if (!mime || !/pdf|word|doc|openxml/i.test(mime)) {
      throw "Reply to a PDF or Word document.";
    }

    const question = args.join(" ") || "Summarize this document";
    const buffer = await q.download();
    if (buffer.length > 10 * 1024 * 1024) return reply("⚠️ File too large (max 10 MB).");

    const ext = mime.includes("pdf") ? ".pdf" : mime.includes("word") ? ".doc" : ".docx";
    const name = `document${ext}`;
    const tmp = path.join(os.tmpdir(), `doc_${Date.now()}${ext}`);
    fs.writeFileSync(tmp, buffer);

    await reply("⏳ Uploading document to Catbox…");

    const form = new FormData();
    form.append("fileToUpload", fs.createReadStream(tmp), name);
    form.append("reqtype", "fileupload");

    const catbox = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
      timeout: 30000
    });

    if (!catbox.data) throw "Catbox upload failed.";
    fs.unlinkSync(tmp);

    await reply("🤖 Asking Gemini AI…");

    const docUrl = catbox.data;
    const encodedQ = encodeURIComponent(question);
    const encodedUrl = encodeURIComponent(docUrl);
    const geminiRes = await axios.get(`https://bk9.fun/ai/GeminiDocs?q=${encodedQ}&url=${encodedUrl}`);
    
    const result = geminiRes.data;

    reply(
      `*📄 Document Analysis*\n\n` +
      `❓ *Question:* ${question}\n` +
      `🔗 *Doc URL:* ${docUrl}\n\n` +
      `🧠 *AI Response:*\n${result.BK9 || result.response || "No answer."}\n\n` +
      `> ᴍᴀᴅᴇ ʙʏ Guru`
    );
  } catch (e) {
    console.error("docanalyze error:", e);
    reply(`❌ ${e.message || e}`);
  }
});
