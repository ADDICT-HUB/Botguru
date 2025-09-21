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
  ai: '🤖', anime: '🍥', audio: '🎧', bible: '📖', download: '⬇️',
  downloader: '📥', fun: '🎮', game: '🕹️', group: '👥', img_edit: '🖌️',
  info: 'ℹ️', information: '🧠', logo: '🖼️', main: '🏠', media: '🎞️',
  menu: '📜', misc: '📦', music: '🎵', other: '📁', owner: '👑',
  privacy: '🔒', search: '🔎', settings: '⚙️', sticker: '🌟', tools: '🛠️',
  user: '👤', utilities: '🧰', utility: '🧮', wallpapers: '🖼️', whatsapp: '📱'
};

function flicker(text) {
  const variants = ['✨', '⚡', '🌟'];
  const random = variants[Math.floor(Math.random() * variants.length)];
  return `${random} ${text} ${random}`;
}

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

    // Group commands by category
    const categories = {};
    for (const cmd of commands) {
      if (cmd.category && !cmd.dontAdd && cmd.pattern) {
        const normalizedCategory = normalize(cmd.category);
        categories[normalizedCategory] = categories[normalizedCategory] || [];
        categories[normalizedCategory].push(cmd.pattern.split('|')[0]);
      }
    }

    // Build menu with clean design
    let menu = `
╔═══════════════╗
        ⚡ BOT GURU ⚡
╚═══════════════╝

👤  User     : @${sender.split('@')[0]}
⏱  Uptime   : ${uptime()}
🛠  Mode     : ${config.MODE}
⌨️  Prefix   : ${config.PREFIX}
👑  Owner    : ${config.OWNER_NAME}
📦  Plugins  : ${commands.length}
💻  Dev      : Its guru
🗂  Version  : 2.0.0
🕒  Time     : ${time} (${timezone})
📅  Date     : ${date}
━━━━━━━━━━━━━━━━━━━━━`;

    for (const cat of Object.keys(categories).sort()) {
      const emoji = emojiByCategory[cat] || '💫';
      menu += `\n\n╭─ ${flicker(emoji + ' ' + toUpperStylized(cat) + ' Menu')} ─╮`;
      menu += `\n│ ${getLoadingBar()}`;
      for (const cmd of categories[cat].sort()) {
        menu += `\n│ ${prefix}${cmd}`;
      }
      menu += `\n╰─────────────────╯`;
    }

    // Newsletter section
    menu += `\n\n╭─ 📰 Newsletter ─╮`;
    menu += `\n│ Subscribe here: ${config.NEWSLETTER_JID || '120363419810795263@newsletter'}`;
    menu += `\n╰─────────────────╯`;

    menu += `\n\n> ${config.DESCRIPTION || toUpperStylized('Explore the bot commands!')}`;

    // Send menu once
    await malvin.sendMessage(
      from,
      {
        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/op2ca2.jpg' },
        caption: menu,
        contextInfo: { mentionedJid: [sender] }
      },
      { quoted: mek }
    );

    // --- Send music/audio immediately after the menu ---
    const audioUrl = config.MENU_AUDIO_URL || 'https://files.catbox.moe/p386a0.mp3';
    await malvin.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: false
    }, { quoted: mek });

  } catch (e) {
    console.error('Menu Error:', e.message);
    await reply(`❌ ${toUpperStylized('Error')}: Failed to show menu.\n${toUpperStylized('Details')}: ${e.message}`);
  }
});
