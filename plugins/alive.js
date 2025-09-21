const { malvin } = require("../malvin");
const config = require("../settings");
const os = require("os");
const { runtime } = require("../lib/functions");
const moment = require("moment-timezone");

malvin({
    pattern: "alive",
    alias: ["alive2"],
    desc: "Check bot status & uptime",
    category: "main",
    react: "💡",
    filename: __filename
}, async (client, mek, m, { from }) => {
    try {
        // Kenyan time
        const now = moment().tz("Africa/Nairobi");
        const hour = now.hour();
        const greeting =
            hour < 12 ? "🌅 Good Morning" :
            hour < 18 ? "☀️ Good Afternoon" :
            "🌙 Good Evening";

        const pushname = m.pushName || "User";
        const currentTime = now.format("HH:mm:ss");
        const currentDate = now.format("dddd, MMMM Do YYYY");
        const uptime = runtime(process.uptime());
        const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        const ALIVE_IMG = "https://files.catbox.moe/op2ca2.jpg"; // your main image

        const msg = `
╭─★✨ *BOT GURU ALIVE* ✨★─╮
│ ${greeting}, *${pushname}*
│ 🕓 ᴛɪᴍᴇ: *${currentTime}*
│ 📆 ᴅᴀᴛᴇ: *${currentDate}*
│ 🧭 ᴜᴘᴛɪᴍᴇ: *${uptime}*
│ ⚙️ ᴍᴏᴅᴇ: *${config.MODE}*
│ 💻 ᴍᴇᴍᴏʀʏ ᴜsᴇ: *${mem} MB*
│ 🔰 ᴠᴇʀsɪᴏɴ: *${config.version}*
╰─★💠 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴏᴛ ɢᴜʀᴜ 💠★─╯
        `.trim();

        await client.sendMessage(
            from,
            {
                image: { url: ALIVE_IMG },
                caption: msg,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    // ✅ Your newsletter kept intact
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363419810795263@newsletter",
                        newsletterName: "its guru",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (err) {
        console.error("Error in .alive:", err);
        await client.sendMessage(
            from,
            { text: `❌ Alive Error:\n${err.message}` },
            { quoted: mek }
        );
    }
});
