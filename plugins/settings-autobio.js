const axios = require('axios');
const config = require('../settings');
const { malvin } = require('../malvin');
const fs = require('fs');

let bioInterval;
const defaultBio = config.AUTO_BIO_TEXT || "BOT GURU| ǫᴜᴏᴛᴇ: {quote} | Time: {time}";
const quoteApiUrl = config.QUOTE_API_URL || 'https://apis.davidcyriltech.my.id/random/quotes';
const updateInterval = config.AUTO_BIO_INTERVAL || 30 * 1000; // 30 seconds

const fallbackQuotes = [
    "Stay curious, keep learning!",
    "Dream big, work hard!",
    "The best is yet to come.",
    "Keep it real, always.",
    "Life is a journey, enjoy it!"
];

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

// ==================  COMMAND  ==================
malvin({
    pattern: 'autobio',
    alias: ['autoabout'],
    desc: 'Toggle automatic bio updates with random quotes and Kenya time',
    category: 'misc',
    filename: __filename,
    usage: `${config.PREFIX}autobio [on/off] [text]`
}, async (malvin, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("❌ ᴏɴʟʏ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs");

    const [action, ...bioParts] = args;
    const customBio = bioParts.join(' ') || defaultBio;

    try {
        if (action === 'on') {
            config.AUTO_BIO = "true";
            config.AUTO_BIO_TEXT = customBio;
            startAutoBio(malvin, customBio);
            return reply(`✅ ᴀᴜᴛᴏ-ʙɪᴏ ᴇɴᴀʙʟᴇᴅ\nᴄᴜʀʀᴇɴᴛ ᴛᴇxᴛ: "${customBio}"`);
        } else if (action === 'off') {
            config.AUTO_BIO = "false";
            stopAutoBio();
            return reply("✅ ᴀᴜᴛᴏ-ʙɪᴏ ᴅɪsᴀʙʟᴇᴅ");
        } else {
            return reply(
                `╭━━〔 🤖 *ᴀᴜᴛᴏ-ʙɪᴏ* 〕━━┈⊷\n` +
                `│ 📜 Usage:\n` +
                `│ ➸ ${config.PREFIX}autobio on [text]\n` +
                `│ ➸ ${config.PREFIX}autobio off\n` +
                `│ 🔖 Status: ${config.AUTO_BIO === "true" ? 'ON' : 'OFF'}\n` +
                `│ 📝 Text: "${config.AUTO_BIO_TEXT || defaultBio}"\n` +
                `│ 🕒 Kenya Time: ${getKenyaTime()}\n` +
                `╰──────────────┈⊷`
            );
        }
    } catch (err) {
        console.error('Auto-bio error:', err.message);
        return reply("❌ Failed to update auto-bio settings");
    }
});

// ==================  CORE FUNCTIONS  ==================
async function fetchQuote() {
    try {
        const response = await axios.get(quoteApiUrl);
        if (response.status === 200 && response.data.content) return response.data.content;
        throw new Error('Invalid quote API response');
    } catch (error) {
        console.error('Quote fetch error:', error.message);
        return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    }
}

async function startAutoBio(malvin, bioText) {
    stopAutoBio();
    const update = async () => {
        try {
            const quote = await fetchQuote();
            const kenyaTime = getKenyaTime();
            const formattedBio = bioText
                .replace('{quote}', quote)
                .replace('{time}', kenyaTime);
            await malvin.updateProfileStatus(formattedBio);
        } catch (error) {
            console.error('Bio update error:', error.message);
        }
    };
    await update(); // first update immediately
    bioInterval = setInterval(update, updateInterval);
}

function stopAutoBio() {
    if (bioInterval) clearInterval(bioInterval);
    bioInterval = null;
}

// ==================  AUTO-START ON SESSION LINK  ==================
module.exports.init = (malvin) => {
    // 🔥 Start automatically if AUTO_BIO is already enabled in settings.js
    if (config.AUTO_BIO === "true") {
        const bioText = config.AUTO_BIO_TEXT || defaultBio;
        startAutoBio(malvin, bioText);
    }
};
