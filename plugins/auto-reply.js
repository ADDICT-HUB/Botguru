const fs = require('fs');
const path = require('path');
const config = require('../settings');
const { malvin } = require('../malvin');

const filePath = path.join(__dirname, '../autos/autoreply.json');

// Load autoreplies once at startup
let autoReplies = {};
try {
    autoReplies = JSON.parse(fs.readFileSync(filePath, 'utf8'));
} catch (e) {
    console.error('❌ Failed to load autoreplies:', e.message);
}

// Auto reply
malvin({
    on: "body"
}, async (malvin, mek, m, { from, body, isOwner }) => {
    if (!body) return;
    const text = body.toLowerCase();

    for (const key in autoReplies) {
        if (text === key.toLowerCase()) {
            if (config.AUTO_REPLY !== 'true') return;
            // Skip owner if you want
            // if (isOwner) return;

            await malvin.sendMessage(from, { text: autoReplies[key] }, { quoted: mek });
        }
    }
});
