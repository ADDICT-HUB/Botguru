const config = require('../settings');
const { malvin } = require('../malvin');
const os = require('os');

malvin({
    pattern: "list",
    alias: ["listcmd", "commands"],
    desc: "Show bot command menu",
    category: "menu",
    react: "⚡",
    filename: __filename
}, async (malvin, mek, m, { from, reply }) => {
    try {
        // 📊 Runtime & Ping
        const runtime = (seconds) => {
            const d = Math.floor(seconds / (3600 * 24));
            const h = Math.floor((seconds % (3600 * 24)) / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);
            return `${d}d ${h}h ${m}m ${s}s`;
        };
        const uptime = runtime(process.uptime());
        const ping = Date.now() - m.messageTimestamp;

        // ✨ Modern Menu Text
        const menuText = `
⚡ *BOT GURU COMMANDS* ⚡
────────────────────────
🕐 Uptime : ${uptime}
📶 Ping   : ${ping} ms

🎶 *DOWNLOAD*
• .play  – YouTube audio
• .song  – Download song
• .apk   – Play Store APK
• .video – YouTube video
• .fb    – Facebook video
• .tk    – TikTok video
• .ig    – Instagram video
• .gdrive – Google Drive
• .twitter – Twitter video
• .img     – Random image
• .drama   – Episode video
• .play2   – Alt audio
• .video2  – Alt video
• .baiscope– Baiscope video
• .mfire   – MediaFire files

🌸 *ANIME*
• .yts       – YouTube search
• .king      – Info about King
• .dog       – Random dog
• .anime     – Anime pictures
• .animegirl – Anime girls
• .loli      – Romantic anime

ℹ️ *INFO*
• .alive   – Check bot online
• .ping    – Bot speed
• .menu    – Main menu
• .menu2   – Alternate menu
• .ai      – AI chat
• .system  – System status
• .owner   – Owner info
• .status  – Runtime info
• .about   – About bot
• .list    – Command list
• .script  – Repository link

🎲 *OTHER*
• .joke        – Random joke
• .fact        – Random fact
• .githubstalk – GitHub info
• .gpass       – Strong password
• .hack        – Fun prank
• .srepo       – Search repos
• .define      – Word meanings

👥 *GROUP*
• .mute      – Mute group
• .unmute    – Unmute group
• .left      – Bot leaves
• .remove    – Remove member
• .add       – Add member
• .kick      – Kick user
• .kickall   – Kick all
• .promote   – Make admin
• .demote    – Remove admin
• .tagall    – Mention all
• .setgoodbye– Leave msg
• .setwelcome– Welcome msg
• .ginfo     – Group info

👑 *OWNER*
• .update   – Update bot
• .restart  – Restart bot
• .settings – View settings
• .block    – Block user
• .unblock  – Unblock user
• .shutdown – Shutdown bot
• .setpp    – Update profile pic

🔄 *CONVERT*
• .sticker – Photo ➜ sticker
• .tts     – Text ➜ speech
• .trt     – Translate

${config.DESCRIPTION || ""}
        `.trim();

        // 📸 Send with thumbnail & footer button
        await malvin.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/rz7kac.jpg" }, // Your bot logo
                caption: menuText,
                footer: "⚡ BOT GURU • Modern Menu",
                templateButtons: [
                    {
                        urlButton: {
                            displayText: "📂 GitHub Repo",
                            url: "https://github.com/ADDICT-HUB"
                        }
                    }
                ],
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error(e);
        reply(`❌ An error occurred: ${e.message || e}`);
    }
});
