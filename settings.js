const fs = require('fs');
const path = require('path');
const { getConfig } = require('./lib/configdb');
const settings = require('./settingss');

if (fs.existsSync(path.resolve('config.env'))) {
  require('dotenv').config({ path: path.resolve('config.env') });
}

// Helper to convert "true"/"false" strings to actual boolean
function convertToBool(text, trueValue = 'true') {
  return text === trueValue;
}

module.exports = {
  // ===== BOT CORE SETTINGS =====
  SESSION_ID: settings.SESSION_ID || process.env.SESSION_ID || "", 
  PREFIX: getConfig("PREFIX") || settings.PREFIX || ".", 
  CHATBOT: getConfig("CHATBOT") || "true", 
  BOT_NAME: getConfig("BOT_NAME") || process.env.BOT_NAME || "Bot GURU", 
  MODE: getConfig("MODE") || process.env.MODE || "private", 
  REPO: process.env.REPO || "https://github.com/ADDICT-HUB/Botguru", 
  PAIRING_CODE: process.env.PARING_CODE || 'true', 
  BAILEYS: process.env.BAILEYS || "@whiskeysockets/baileys",

  // ===== OWNER & DEVELOPER SETTINGS =====
  OWNER_NUMBER: settings.OWNER_NUMBER || process.env.OWNER_NUMBER || "254116284050",
  OWNER_NAME: getConfig("OWNER_NAME") || process.env.OWNER_NAME || "GURU",
  DEV: process.env.DEV || "254116284050",
  DEVELOPER_NUMBER: '254116284050@s.whatsapp.net',
  
  // ===== AUDIO & MEDIA =====
  MENU_AUDIO_URL: getConfig("MENU_AUDIO_URL") || process.env.MENU_AUDIO_URL || 'https://files.catbox.moe/p386a0.mp3',
  AUDIO_URL: getConfig("AUDIO_URL") || process.env.AUDIO_URL || 'https://files.catbox.moe/p386a0.mp3',
  AUDIO_URL2: getConfig("AUDIO_URL2") || process.env.AUDIO_URL2 || 'https://files.catbox.moe/p386a0.mp3',
  
  NEWSLETTER_JID: process.env.NEWSLETTER_JID || '120363417996705218@newsletter',

  // ===== AUTO-RESPONSE SETTINGS =====
  AUTO_REPLY: "true",
  AUTO_STATUS_REPLY: "true",
  AUTO_STATUS_MSG: "*Just seen ur status 😆 🤖*",
  READ_MESSAGE: "true",
  REJECT_MSG: "*📵 Calls are not allowed on this number unless you have permission. 🚫*",
  ALIVE_IMG: "https://files.catbox.moe/rz7kac.jpg",
  LIVE_MSG: "> ʙᴏᴛ ɪs sᴘᴀʀᴋɪɴɢ ᴀᴄᴛɪᴠᴇ ᴀɴᴅ ᴀʟɪᴠᴇ\n> ɢɪᴛʜᴜʙ : github.com/ADDICT-HUB/Botguru",

  // ===== REACTION & STICKER SETTINGS =====
  AUTO_REACT: "true",
  OWNER_REACT: "true",
  CUSTOM_REACT: "true",
  CUSTOM_REACT_EMOJIS: "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
  STICKER_NAME: "BOT GURU",
  AUTO_STICKER: "true",

  // ===== MEDIA & AUTOMATION =====
  AUTO_RECORDING: "true",
  AUTO_TYPING: "true",
  MENTION_REPLY: "true",
  MENU_IMAGE_URL: "https://files.catbox.moe/rz7kac.jpg",

  // ===== SECURITY & ANTI-FEATURES =====
  ANTI_DELETE: "true",
  ANTI_CALL: "true",
  ANTI_BAD_WORD: "true",
  ANTI_LINK: "true",
  ANTI_VV: "true",
  DELETE_LINKS: "true",
  ANTI_DEL_PATH: "inbox",
  ANTI_BOT: "true",
  PM_BLOCKER: "true",

  // ===== BOT BEHAVIOR & APPEARANCE =====
  DESCRIPTION: "*ᴍᴀᴅᴇ ʙʏ BOT GURU*",
  PUBLIC_MODE: "true",
  ALWAYS_ONLINE: "true",
  AUTO_STATUS_REACT: "true",
  AUTO_STATUS_SEEN: "true",
  AUTO_BIO: "true",
  AUTO_BIO_TEXT: "BOT GURU | Quote: {quote} | Time: {time}",
  QUOTE_API_URL: "https://apis.davidcyriltech.my.id/random/quotes",
  AUTO_BIO_INTERVAL: 30000, // 30 seconds
  WELCOME: "true",
  GOODBYE: "true",
  ADMIN_ACTION: "true",
  version: "1.5.0",
  TIMEZONE: "Africa/Nairobi",

  // ===== CATEGORY-SPECIFIC IMAGE URLs =====
  MENU_IMAGES: {
    '1': "https://url.bwmxmd.online/Adams.0dhfcjpi.jpeg",
    '2': "https://url.bwmxmd.online/Adams.xm472dqv.jpeg",
    '3': "https://url.bwmxmd.online/Adams.0dhfcjpi.jpeg",
    '4': "https://url.bwmxmd.online/Adams.0dhfcjpi.jpeg",
    '5': "https://url.bwmxmd.online/Adams.zjrmnw18.jpeg",
    '6': "https://url.bwmxmd.online/Adams.h0gop5c7.jpeg",
    '7': "https://url.bwmxmd.online/Adams.0dhfcjpi.jpeg",
    '8': "https://url.bwmxmd.online/Adams.zjrmnw18.jpeg",
    '9': "https://url.bwmxmd.online/Adams.xm472dqv.jpeg",
    '10': "https://url.bwmxmd.online/Adams.0dhfcjpi.jpeg",
    '11': "https://url.bwmxmd.online/Adams.h0gop5c7.jpeg",
    '12': "https://url.bwmxmd.online/Adams.0dhfcjpi.jpeg",
    '13': "https://url.bwmxmd.online/Adams.h0gop5c7.jpeg",
    '14': "https://url.bwmxmd.online/Adams.xm472dqv.jpeg"
  }
};
