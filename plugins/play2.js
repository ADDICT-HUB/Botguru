const config = require('../settings');
const { malvin } = require('../malvin');
const fetch = require('node-fetch');
const ytSearch = require('yt-search');
const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const os = require('os');

const streamPipeline = promisify(pipeline);
const tmpDir = os.tmpdir();

function toFancyFont(text) {
  const fonts = {
    a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ғ", g: "ɢ", h: "ʜ",
    i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ",
    q: "ǫ", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x",
    y: "ʏ", z: "ᴢ"
  };
  return text.toLowerCase().split("").map(char => fonts[char] || char).join("");
}

malvin({
    pattern: "playfast",
    alias: ["playguru","ytguru"],
    react: "🎶",
    desc: "Download best-quality audio or video from YouTube",
    category: "main",
    use: ".playfast <song name or link>",
    filename: __filename
}, async (malvin, mek, m, { from, q, reply, react: doReact, sender }) => {
    try {
        if (!q) return reply("Please provide a song name or YouTube link.");

        // 🔎 Search or detect link
        let ytUrl = '';
        if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(q)) {
            ytUrl = q.trim();
        } else {
            const search = await ytSearch(q);
            if (!search.videos.length) return reply("No results found.");
            ytUrl = search.videos[0].url;
        }

        // 🎥 Fetch video details
        const searchInfo = await ytSearch({ videoId: ytUrl.split("v=")[1] || ytUrl });
        const info = searchInfo?.videos?.[0] || {};

        const caption = `
🤖 *BOT GURU* Downloader
👤 Owner: Guru

${toFancyFont("🎶 Title")}: ${info.title || 'Unknown'}
${toFancyFont("⏳ Duration")}: ${info.timestamp || 'N/A'}
${toFancyFont("👀 Views")}: ${info.views?.toLocaleString() || 'N/A'}
${toFancyFont("🔗 URL")}: ${ytUrl}

Choose download type:
`;

        const buttons = [
            { buttonId: `download_guru_audio_${encodeURIComponent(ytUrl)}`, buttonText: { displayText: "🎧 Audio (HQ)" }, type: 1 },
            { buttonId: `download_guru_video_${encodeURIComponent(ytUrl)}`, buttonText: { displayText: "🎬 Video (HQ)" }, type: 1 }
        ];

        await malvin.sendMessage(from, {
            image: { url: info.thumbnail || "https://i.ibb.co/2d3JXhW/guru.jpg" },
            caption,
            buttons,
            viewOnce: true,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        await doReact("❌");
        reply("❌ BOT GURU error. Try again later.");
    }
});

// 🔘 Button handler
const handleButtons = async (malvin, mek, m, { from, reply }) => {
    if (m.buttonId.startsWith("download_guru_")) {
        try {
            const [ , , type, rawUrl ] = m.buttonId.split("_");
            const ytUrl = decodeURIComponent(rawUrl);
            await malvin.sendMessage(from, {
                text: `🤖 BOT GURU\n⚡ Downloading *${type.toUpperCase()}* in best quality...\nPlease wait...`
            }, { quoted: mek });

            // Use DavidCyril API for high-quality direct link
            const api = `https://apis.davidcyriltech.my.id/${type === "audio" ? "play" : "video"}?query=${encodeURIComponent(ytUrl)}`;
            const res = await fetch(api);
            const data = await res.json();
            if (!data.status || !(data.result.download_url || data.result.url))
                return reply("Download failed. Try again later.");

            const dlUrl = data.result.download_url || data.result.url;
            const safeTitle = (data.result.title || 'Guru_Song')
                .replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').substring(0, 90);
            const ext = type === "audio" ? "mp3" : "mp4";
            const filePath = `${tmpDir}/BOT_GURU_${safeTitle}.${ext}`;

            const response = await fetch(dlUrl);
            if (!response.ok) throw new Error(`Download failed: ${response.status}`);
            const fileStream = fs.createWriteStream(filePath);
            await streamPipeline(response.body, fileStream);

            if (type === "audio") {
                await malvin.sendMessage(from, {
                    audio: { url: filePath },
                    mimetype: "audio/mpeg",
                    fileName: `BOT_GURU_${safeTitle}.mp3`
                }, { quoted: mek });
            } else {
                await malvin.sendMessage(from, {
                    video: { url: filePath },
                    mimetype: "video/mp4",
                    fileName: `BOT_GURU_${safeTitle}.mp4`
                }, { quoted: mek });
            }

            setTimeout(() => fs.existsSync(filePath) && fs.unlinkSync(filePath), 5000);
        } catch (err) {
            console.error(err);
            reply("❌ BOT GURU failed to deliver the file.");
        }
    }
};

module.exports = { malvin, handleButtons };
