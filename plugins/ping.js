const config = require('../settings');
const { malvin } = require('../malvin');
const moment = require('moment-timezone');
const os = require("os");

// Bot start time
const botStartTime = process.hrtime.bigint();

// Cache for timezone formatting
const formatCache = new Map();

const emojiSets = {
    reactions: ['⚡', '🚀', '💨', '🎯', '🌟', '💎', '🔥', '✨', '🌀', '🔹'],
    status: [
        { threshold: 0.3, text: '🚀 Super Fast' },
        { threshold: 0.6, text: '⚡ Fast' },
        { threshold: 1.0, text: '⚠️ Medium' },
        { threshold: Infinity, text: '🐢 Slow' }
    ]
};

// CPU usage %
function getCpuUsage() {
    const cpus = os.cpus();
    let idle = 0, total = 0;
    cpus.forEach(cpu => {
        for (let type in cpu.times) total += cpu.times[type];
        idle += cpu.times.idle;
    });
    return (100 - Math.round(100 * idle / total));
}

// Progress bar builder
function makeBar(value, max = 100, size = 10) {
    const filled = Math.round((value / max) * size);
    const empty = size - filled;
    return '▰'.repeat(filled) + '▱'.repeat(empty);
}

malvin({
    pattern: 'ping',
    alias: ['speed', 'pong','p'],
    desc: 'Check bot\'s response time and status',
    category: 'main',
    react: '⚡',
    filename: __filename
}, async (malvin, mek, m, { from, sender, reply }) => {
    try {
        const timezone = config.TIMEZONE || 'Africa/Harare';
        const ownerName = config.OWNER_NAME || 'Guru';
        const botName = config.BOT_NAME || 'Botguru';
        const repoLink = config.REPO || 'https://github.com/ADDICT-HUB/Botguru';

        // Function to build dashboard
        const makeDashboard = () => {
            const start = process.hrtime.bigint();
            const responseTime = Number(process.hrtime.bigint() - start) / 1e9;
            const statusText = emojiSets.status.find(s => responseTime < s.threshold)?.text || '🐢 Slow';

            // Time info
            const cacheKey = `${timezone}:${moment().format('YYYY-MM-DD HH:mm:ss')}`;
            let time, date;
            if (formatCache.has(cacheKey)) {
                ({ time, date } = formatCache.get(cacheKey));
            } else {
                time = moment().tz(timezone).format('HH:mm:ss');
                date = moment().tz(timezone).format('DD/MM/YYYY');
                formatCache.set(cacheKey, { time, date });
                if (formatCache.size > 100) formatCache.clear();
            }

            // Uptime
            const uptimeSeconds = Number(process.hrtime.bigint() - botStartTime) / 1e9;
            const uptime = moment.duration(uptimeSeconds, 'seconds').humanize();

            // Memory
            const memory = process.memoryUsage();
            const usedMB = memory.heapUsed / 1024 / 1024;
            const totalMB = memory.heapTotal / 1024 / 1024;
            const memPercent = (usedMB / totalMB) * 100;

            // Node version
            const nodeVersion = process.version;

            // CPU
            const cpuPercent = getCpuUsage();

            return `
╔══════════════════════╗
   ⚡ BOT GURU ⚡
╚══════════════════════╝

🟢 *Status*     : ${statusText}
⚡ *Response*   : ${responseTime.toFixed(2)}s
⏳ *Uptime*     : ${uptime}

💾 *Memory*     
   ${makeBar(memPercent)} ${usedMB.toFixed(2)}/${totalMB.toFixed(2)} MB (${memPercent.toFixed(1)}%)

🖥️ *CPU*        
   ${makeBar(cpuPercent)} ${cpuPercent.toFixed(1)}%

📟 *Node.js*    : ${nodeVersion}
📅 *Date*       : ${date}
⏰ *Time*       : ${time} (${timezone})

━━━━━━━━━━━━━━━━━━━━━━━
👑 *Owner*      : ${ownerName}
🤖 *Bot Name*   : ${botName}

🔗 ${repoLink}
━━━━━━━━━━━━━━━━━━━━━━━
`.trim();
        };

        // Send first dashboard
        let sentMsg = await malvin.sendMessage(from, {
            text: makeDashboard(),
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363419810795263@newsletter',
                    newsletterName: `Its guru`,
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Auto-refresh every second
        setInterval(async () => {
            try {
                await malvin.sendMessage(from, {
                    edit: sentMsg.key,
                    text: makeDashboard()
                });
            } catch (e) {
                console.error("⚠️ Auto-refresh error:", e);
            }
        }, 1000);

    } catch (e) {
        console.error('❌ Ping command error:', e);
        await reply(`❌ Error: ${e.message || 'Failed to process ping command'}`);
    }
});
