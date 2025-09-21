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
  
  MENU_AUDIO_URL: getConfig("MENU_AUDIO_URL") || process.env.MENU_AUDIO_URL || 'https://files.catbox.moe/p386a0.mp3',
  AUDIO_URL: getConfig("AUDIO_URL") || process.env.AUDIO_URL || 'https://files.catbox.moe/p386a0.mp3',
  AUDIO_URL2: getConfig("AUDIO_URL2") || process.env.AUDIO_URL2 || 'https://files.catbox.moe/p386a0.mp3',
  
  NEWSLETTER_JID: process.env.NEWSLETTER_JID || '120363417996705218@newsletter',

  // ===== AUTO-RESPONSE SETTINGS =====
  AUTO_REPLY: getConfig("AUTO_REPLY") || process.env.AUTO_REPLY || "true",
  AUTO_STATUS_REPLY: getConfig("AUTO_STATUS_REPLY") || process.env.AUTO_STATUS_REPLY || "true",
  AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*Just seen ur status 😆 🤖*",
  READ_MESSAGE: getConfig("READ_MESSAGE") || process.env.READ_MESSAGE || "true",
  REJECT_MSG: process.env.REJECT_MSG || "*📵 Calls are not allowed on this number unless you have permission. 🚫*",
  ALIVE_IMG: getConfig("ALIVE_IMG") || process.env.ALIVE_IMG || "https://files.catbox.moe/rz7kac.jpg",
  LIVE_MSG: process.env.LIVE_MSG || "> ʙᴏᴛ ɪs sᴘᴀʀᴋɪɴɢ ᴀᴄᴛɪᴠᴇ ᴀɴᴅ ᴀʟɪᴠᴇ\n\n\n> ɢɪᴛʜᴜʙ :* github.com/ADDICT-HUB/Botguru",

  // ===== REACTION & STICKER SETTINGS =====
  AUTO_REACT: getConfig("AUTO_REACT") || process.env.AUTO_REACT || "true",
  OWNER_REACT: getConfig("OWNER_REACT") || process.env.OWNER_REACT || "true",
  CUSTOM_REACT: getConfig("CUSTOM_REACT") || process.env.CUSTOM_REACT || "true",
  CUSTOM_REACT_EMOJIS: getConfig("CUSTOM_REACT_EMOJIS") || process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
  STICKER_NAME: process.env.STICKER_NAME || "BOT GURU",
  AUTO_STICKER: getConfig("AUTO_STICKER") || process.env.AUTO_STICKER || "true",

  // ===== MEDIA & AUTOMATION =====
  AUTO_RECORDING: getConfig("AUTO_RECORDING") || process.env.AUTO_RECORDING || "true",
  AUTO_TYPING: getConfig("AUTO_TYPING") || process.env.AUTO_TYPING || "true",
  MENTION_REPLY: getConfig("MENTION_REPLY") || process.env.MENTION_REPLY || "true",
  MENU_IMAGE_URL: getConfig("MENU_IMAGE_URL") || process.env.MENU_IMAGE_URL || "https://files.catbox.moe/rz7kac.jpg",

  // ===== SECURITY & ANTI-FEATURES =====
  ANTI_DELETE: getConfig("ANTI_DELETE") || process.env.ANTI_DELETE || "true",
  ANTI_CALL: getConfig("ANTI_CALL") || process.env.ANTI_CALL || "true",
  ANTI_BAD_WORD: getConfig("ANTI_BAD_WORD") || process.env.ANTI_BAD_WORD || "true",
  ANTI_LINK: getConfig("ANTI_LINK") || process.env.ANTI_LINK || "true",
  ANTI_VV: getConfig("ANTI_VV") || process.env.ANTI_VV || "true",
  DELETE_LINKS: getConfig("DELETE_LINKS") || process.env.DELETE_LINKS || "true",
  ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox",
  ANTI_BOT: getConfig("ANTI_BOT") || process.env.ANTI_BOT || "true",
  PM_BLOCKER: getConfig("PM_BLOCKER") || process.env.PM_BLOCKER || "true",

  // ===== BOT BEHAVIOR & APPEARANCE =====
  DESCRIPTION: process.env.DESCRIPTION || "*ᴍᴀᴅᴇ ʙʏ BOT GURU*",
  PUBLIC_MODE: getConfig("PUBLIC_MODE") || process.env.PUBLIC_MODE || "true",
  ALWAYS_ONLINE: getConfig("ALWAYS_ONLINE") || process.env.ALWAYS_ONLINE || "true",
  AUTO_STATUS_REACT: getConfig("AUTO_STATUS_REACT") || process.env.AUTO_STATUS_REACT || "true",
  AUTO_STATUS_SEEN: getConfig("AUTO_STATUS_SEEN") || process.env.AUTO_STATUS_SEEN || "true",
  AUTO_BIO: getConfig("AUTO_BIO") || process.env.AUTO_BIO || "true",
  WELCOME: getConfig("WELCOME") || process.env.WELCOME || "true",
  GOODBYE: getConfig("GOODBYE") || process.env.GOODBYE || "true",
  ADMIN_ACTION: getConfig("ADMIN_ACTION") || process.env.ADMIN_ACTION || "true",
  version: process.env.version || "1.5.0",
  TIMEZONE: settings.TIMEZONE || process.env.TIMEZONE || "Africa/Harare",

  // ===== CATEGORY-SPECIFIC IMAGE URLs =====
  MENU_IMAGES: {
    '1': process.env.DOWNLOAD_MENU_IMAGE || "https://url.bwmxmd.online/Adams.0dhfcjpi.jpeg",
    '2': process.env.GROUP_MENU_IMAGE || "https://url.bwmxmd.online/Adams.xm472dqv.jpeg",
    '3': process.env.FUN_MENU_IMAGE || "https://url.bwmxmd.online/Adams.0dhfcjpi.jpeg",
    '4': process.env.OWNER_MENU_IMAGE || "https://url.bwmxmd.online/Adams.0dhfcjpi.jpeg",
    '5': process.env.AI_MENU_IMAGE || "https://url.bwmxmd.online/Adams.zjrmnw18.jpeg",
    '6': process.env.ANIME_MENU_IMAGE || "https://url.bwmxmd.online/Adams.h0gop5c7.jpeg",
    '7': process.env.CONVERT_MENU_IMAGE || "https://url.bwmxmd.online/Adams.0dhfcjpi.jpeg",
    '8': process.env.OTHER_MENU_IMAGE || "https://url.bwmxmd.online/Adams.zjrmnw18.jpeg",
    '9': process.env.REACTION_MENU_IMAGE || "https://url.bwmxmd.online/Adams.xm472dqv.jpeg",
    '10': process.env.MAIN_MENU_IMAGE || "https://url.bwmxmd.online/Adams.0dhfcjpi.jpeg",
    '11': process.env.LOGO_MAKER_MENU_IMAGE || "https://url.bwmxmd.online/Adams.h0gop5c7.jpeg",
    '12': process.env.SETTINGS_MENU_IMAGE || "https://url.bwmxmd.online/Adams.0dhfcjpi.jpeg",
    '13': process.env.AUDIO_MENU_IMAGE || "https://url.bwmxmd.online/Adams.h0gop5c7.jpeg",
    '14': process.env.PRIVACY_MENU_IMAGE || "https://url.bwmxmd.online/Adams.xm472dqv.jpeg"
  }
};
