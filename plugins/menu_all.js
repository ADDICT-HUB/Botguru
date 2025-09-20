const config = require('../settings');
const moment = require('moment-timezone');
const { malvin, commands } = require('../malvin');
const { getPrefix } = require('../lib/prefix');

function toUpperStylized(str) {
  const stylized = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.split('').map(c => stylized[c.toUpperCase()] || c).join('');
}

const normalize = (str) => str.toLowerCase().replace(/\s+menu$/, '').trim();

const emojiByCategory = {
  ai: '🤖', anime: '🍥', audio: '🎧', bible: '📖', download: '⬇️', downloader: '📥',
  fun: '🎮', game: '🕹️', group: '👥', img_edit: '🖌️', info: 'ℹ️', information: '🧠',
  logo: '🖼️', main: '🏠', media: '🎞️', menu: '📜', misc: '📦', music: '🎵',
  other: '📁', owner: '👑', privacy: '🔒', search: '🔎', settings: '⚙️',
  sticker: '🌟', tools: '🛠️', user: '👤', utilities: '🧰', utility: '🧮',
  wallpapers: '🖼️', whatsapp: '📱',
};

// Flicker header
function flicker(text) {
  const variants = ['✨', '⚡', '🌟'];
  const random = variants[Math.floor(Math.random() * variants.length)];
  return `${random} ${text} ${random}`;
}

// Loading bars animation
const bars = ['▰▱▱▱▱', '▰▰▱▱▱', '▰▰▰▱▱', '▰▰▰▰▱', '▰▰▰▰▰'];
function getLoadingBar() {
  return bars[Math.floor(Math.random() * bars.length)];
}

malvin({
  pattern: 'menu',
  alias: ['allmenu'],
  desc: 'Show all bot commands',
  category: 'menu',
  react: '👌',
  filename: __filename
}, async (malvin, mek, m, { from, sender, reply }) => {
  try {
    const prefix = getPrefix();

    // Group commands by category
    const categories = {};
    for (const cmd of commands) {
      if (cmd.category && !cmd.dontAdd && cmd.pattern) {
        const normalizedCategory = normalize(cmd.category);
        categories[normalizedCategory] = categories[normalizedCategory] || [];
        categories[normalizedCategory].push(cmd.pattern.split('|')[0]);
      }
    }

    // Send header image once (logo)
    await malvin.sendMessage(from, {
      image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/op2ca2.jpg' },
      caption: flicker('🔹 BOT GURU 🔹')
    }, { quoted: mek });

    // Send initial text message
    const sentMsg = await malvin.sendMessage(from, {
      text: 'Loading menu... Please wait ⏳',
      contextInfo: {
        mentionedJid: [sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: config.NEWSLETTER_JID || '120363419810795263@newsletter',
          newsletterName: config.OWNER_NAME || toUpperStylized('itsguru'),
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Live update every second
    const interval = setInterval(async () => {
      try {
        const timezone = config.TIMEZONE || 'Africa/Nairobi';
        const time = moment().tz(timezone).format('HH:mm:ss');
        const date = moment().tz(timezone).format('dddd, DD MMMM YYYY');

        const uptime = () => {
          let sec = process.uptime();
          let h = Math.floor(sec / 3600);
          let m = Math.floor((sec % 3600) / 60);
          let s = Math.floor(sec % 60);
          return `${h}h ${m}m ${s}s`;
        };

        // Build menu text with logo
        let menu = `
${flicker('🔹 BOT GURU 🔹')}

*┏────〘 BOT GURU 〙───⊷*
*┃ ᴜꜱᴇʀ : @${sender.split('@')[0]}*
*┃ ʀᴜɴᴛɪᴍᴇ : ${uptime()}*
*┃ ᴍᴏᴅᴇ : ${config.MODE}*
*┃ ᴘʀᴇғɪx : 「 ${config.PREFIX}」* 
*┃ ᴏᴡɴᴇʀ : ${config.OWNER_NAME}*
*┃ ᴘʟᴜɢɪɴꜱ : 『 ${commands.length} 』*
*┃ ᴅᴇᴠ : Its guru*
*┃ ᴠᴇʀꜱɪᴏɴ : 2.0.0*
*┗──────────────⊷*`;

        for (const cat of Object.keys(categories).sort()) {
          const emoji = emojiByCategory[cat] || '💫';
          menu += `\n\n*┏─『 ${flicker(emoji + ' ' + toUpperStylized(cat) + ' ' + toUpperStylized('Menu'))} 』──⊷*`;
          menu += `\n*${getLoadingBar()}*`;
          for (const cmd of categories[cat].sort()) {
            menu += `\n*│ ${prefix}${cmd}*`;
          }
          menu += `\n*┗──────────────⊷*`;
        }

        // Newsletter restored
        menu += `\n\n*┏─『 📰 Newsletter 』──⊷*`;
        menu += `\n*│ Subscribe here: ${config.NEWSLETTER_JID || '120363419810795263@newsletter'}*`;
        menu += `\n*┗──────────────⊷*`;

        menu += `\n\n> ${config.DESCRIPTION || toUpperStylized('Explore the bot commands!')}`;

        // Edit the same text message instead of spamming
        await malvin.sendMessage(from, {
          text: menu
        }, { edit: sentMsg.key });

      } catch (err) {
        console.error('Live menu update error:', err);
        clearInterval(interval);
      }
    }, 1000);

  } catch (e) {
    console.error('Menu Error:', e.message);
    await reply(`❌ ${toUpperStylized('Error')}: Failed to show menu. Try again.\n${toUpperStylized('Details')}: ${e.message}`);
  }
});
