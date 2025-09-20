const axios = require('axios');
const fs = require('fs');
const config = require('../settings');
const { malvin } = require('../malvin');

// ====== CONFIG ======
const defaultBio = config.AUTO_BIO_TEXT ||
    "BOT GURU | {pulse} | ǫᴜᴏᴛᴇ: {quote} | Time: {time}";
const quoteApiUrl = config.QUOTE_API_URL ||
    'https://apis.davidcyriltech.my.id/random/quotes';
const updateInterval = config.AUTO_BIO_INTERVAL || 30 * 1000; // 30 sec

// ====== INTERNAL ======
let bioInterval;
let lastStatus = '';
const fallbackQuotes = [
    "Stay curious, keep learning!",
    "Dream big, work hard!",
    "The best is yet to come.",
    "Keep it real, always.",
    "Life is a journey, enjoy it!"
];

// Dynamic pulsing icons ❤️🧡💛💚💙💜
function getPulse() {
    const icons = ['❤️','🧡','💛','💚','💙','💜'];
    return icons[Math.floor(Date.now() / 1000) % icons.length];
}

// Kenya time helper
function getKenyaTime() {
    const options = {
        timeZone: 'Africa/Nairobi',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    };
    return new Date().toLocaleString('en-US', options);
}

// Safe update (avoid spamming same text)
async function safeUpdateStatus(malvin, text) {
    if (text !== lastStatus) {
        lastStatus = text;
        await malvin.updateProfileStatus(text);
    }
}

// Fetch random quote
async function fetchQuote() {
    try {
        const res = await axios.get(quoteApiUrl);
        if (res.status === 200 && res.data.content) return res.data.content;
        throw new Error('Invalid API response');
    } catch (err) {
        console.error('Quote fetch error:', err.message);
        return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    }
}

// Start auto-bio updates
async function startAutoBio(malvin, bioText) {
    stopAutoBio(); // clear any existing interval

    // Immediate first update
    await updateBio(malvin, bioText);

    // Regular interval updates
    bioInterval = setInterval(async () => {
        await updateBio(malvin, bioText);
    }, updateInterval);
}

// Build and send bio
async function updateBio(malvin, bioText) {
    try {
        const quote = await fetchQuote();
        const kenyaTime = getKenyaTime();
        const formattedBio = bioText
            .replace('{quote}', quote)
            .replace('{time}', kenyaTime)
            .replace('{pulse}', getPulse());
        await safeUpdateStatus(malvin, formattedBio);
    } catch (err) {
        console.error('❌ Bio update error:', err.message);
    }
}

// Stop updates
function stopAutoBio() {
    if (bioInterval) {
        clearInterval(bioInterval);
        bioInterval = null;
    }
}

// Command handler
malvin({
    pattern: 'autobio',
    alias: ['autoabout'],
    desc: 'Toggle automatic bio updates with quotes & Kenya time',
    category: 'misc',
    filename: __filename,
    usage: `${config.PREFIX}autobio [on/off] [text]`
const axios = require('axios');
const config = require('../settings');
const { malvin } = require('../malvin');
const fs = require('fs');

let bioInterval;
const defaultBio = config.AUTO_BIO_TEXT || "BOT GURU| ǫᴜᴏᴛᴇ: {quote} | Time: {time}";
const quoteApiUrl = config.QUOTE_API_URL || 'https://apis.davidcyriltech.my.id/random/quotes';
const updateInterval = config.AUTO_BIO_INTERVAL || 30 * 1000; // Default to 30 seconds

// Fallback quotes if API fails
const fallbackQuotes = [
    "Stay curious, keep learning!",
    "Dream big, work hard!",
    "The best is yet to come.",
    "Keep it real, always.",
    "Life is a journey, enjoy it!"
];

// Pulsing heart icons ❤️🧡💛💚💙💜
function getPulse() {
    const icons = ['❤️','🧡','💛','💚','💙','💜'];
    return icons[Math.floor(Date.now() / 1000) % icons.length];
}

// Function to get Kenya time and date
function getKenyaTime() {
    const options = {
        timeZone: 'Africa/Nairobi', // ✅ Real Kenya time zone
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    };
    return new Date().toLocaleString('en-US', options);
}

// Safe update wrapper to avoid spamming
let lastStatus = '';
async function safeUpdateStatus(malvin, text) {
    if (text !== lastStatus) {      // ✅ Avoid repeating same bio
        lastStatus = text;
        await malvin.updateProfileStatus(text);
    }
}

malvin({
    pattern: 'autobio',
    alias: ['autoabout'],
    desc: 'Toggle automatic bio updates with random quotes and Kenya time',
    category: 'misc',
    filename: __filename,
    usage: `${config.PREFIX}autobio [on/off] [text]`
}, async (malvin, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("❌ ᴏɴʟʏ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ");

    const [action, ...bioParts] = args;
    const customBio = bioParts.join(' ') || defaultBio;

    try {
        if (action === 'on') {
            if (config.AUTO_BIO === "true") {
                return reply("ℹ️ ᴀᴜᴛᴏ-ʙɪᴏ ɪs ᴀʟʀᴇᴀᴅʏ ᴇɴᴀʙʟᴇᴅ");
            }

            config.AUTO_BIO = "true";
            config.AUTO_BIO_TEXT = customBio;

            startAutoBio(malvin, customBio);
            return reply(`✅ ᴀᴜᴛᴏ-ʙɪᴏ ᴇɴᴀʙʟᴇᴅ\nᴄᴜʀʀᴇɴᴛ ᴛᴇxᴛ: "${customBio}"`);

        } else if (action === 'off') {
            if (config.AUTO_BIO !== "true") {
                return reply("ℹ️ ᴀᴜᴛᴏ-ʙɪᴏ ɪs ᴀʟʀᴇᴀᴅʏ ᴅɪsᴀʙʟᴇᴅ");
            }

            config.AUTO_BIO = "false";
            stopAutoBio();
            return reply("✅ ᴀᴜᴛᴏ-ʙɪᴏ ᴅɪsᴀʙʟᴇᴅ");

        } else {
            return reply(
                `╭━━〔 🤖 *ᴀᴜᴛᴏ-ʙɪᴏ* 〕━━┈⊷\n` +
                `│\n` +
                `│ 📜 *ᴜsᴀɢᴇ:*\n` +
                `│ ➸ ${config.PREFIX}autobio on [text] - ᴇɴᴀʙʟᴇ ᴡɪᴛʜ ᴄᴜsᴛᴏᴍ ᴛᴇxᴛ\n` +
                `│ ➸ ${config.PREFIX}autobio off - ᴅɪsᴀʙʟᴇ ᴀᴜᴛᴏ-ʙɪᴏ\n` +
                `│\n` +
                `│ 🔖 *ᴘʟᴀᴄᴇʜᴏʟᴅᴇʀs:*\n` +
                `│ ➸ {quote} - ʀᴀɴᴅᴏᴍ ǫᴜᴏᴛᴇ\n` +
                `│ ➸ {time} - ᴋᴇɴʏᴀ ᴛɪᴍᴇ & ᴅᴀᴛᴇ\n` +
                `│ ➸ {pulse} - ᴘᴜʟsɪɴɢ ʜᴇᴀʀᴛ 💜\n` +
                `│\n` +
                `│ 💡 *sᴛᴀᴛᴜs:* ${config.AUTO_BIO === "true" ? 'ON' : 'OFF'}\n` +
                `│ 📝 *ᴛᴇxᴛ:* "${config.AUTO_BIO_TEXT || defaultBio}"\n` +
                `│ 🕒 *ᴋᴇɴʏᴀ ᴛɪᴍᴇ:* ${getKenyaTime()}\n` +
                `╰──────────────┈⊷`
            );
        }
    } catch (error) {
        console.error('❌ Auto-bio error:', error.message);
        return reply("❌ ғᴀɪʟᴇᴅ ᴛᴏ ᴜᴘᴅᴀᴛᴇ ᴀᴜᴛᴏ-ʙɪᴏ sᴇᴛᴛɪɴɢs");
    }
});

// Fetch random quote
async function fetchQuote() {
    try {
        const response = await axios.get(quoteApiUrl);
        if (response.status === 200 && response.data.content) {
            return response.data.content;
        }
        throw new Error('Invalid quote API response');
    } catch (error) {
        console.error('Quote fetch error:', error.message);
        return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    }
}

// Start auto-bio updates
async function startAutoBio(malvin, bioText) {
    stopAutoBio();

    // Update immediately on start
    try {
        const quote = await fetchQuote();
        const kenyaTime = getKenyaTime();
        const formattedBio = bioText
            .replace('{quote}', quote)
            .replace('{time}', kenyaTime)
            .replace('{pulse}', getPulse());
        await safeUpdateStatus(malvin, formattedBio);
    } catch (error) {
        console.error('❌ Initial bio update error:', error.message);
    }

    // Set interval for regular updates
    bioInterval = setInterval(async () => {
        try {
            const quote = await fetchQuote();
            const kenyaTime = getKenyaTime();
            const formattedBio = bioText
                .replace('{quote}', quote)
                .replace('{time}', kenyaTime)
                .replace('{pulse}', getPulse());
            await safeUpdateStatus(malvin, formattedBio);
        } catch (error) {
            console.error('❌ Bio update error:', error.message);
            setTimeout(async () => {
                try {
                    const quote = await fetchQuote();
                    const kenyaTime = getKenyaTime();
                    const formattedBio = bioText
                        .replace('{quote}', quote)
                        .replace('{time}', kenyaTime)
                        .replace('{pulse}', getPulse());
                    await safeUpdateStatus(malvin, formattedBio);
                } catch (retryError) {
                    console.error('❌ Bio retry error:', retryError.message);
                    stopAutoBio();
                }
            }, 5000);
        }
    }, updateInterval);
}

// Stop auto-bio updates
function stopAutoBio() {
    if (bioInterval) {
        clearInterval(bioInterval);
        bioInterval = null;
    }
}

// Initialize auto-bio if enabled
module.exports.init = (malvin) => {
    if (config.AUTO_BIO === "true") {
        const bioText = config.AUTO_BIO_TEXT || defaultBio;
        startAutoBio(malvin, bioText);
    }
};
