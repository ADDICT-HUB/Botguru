const { malvin } = require('../malvin');
const { getPrefix } = require('../lib/prefix');
const axios = require('axios');
const config = require('../settings');

malvin({
  pattern: 'url',
  desc: 'Generate or shorten a URL',
  category: 'tools',
  react: '🔗',
  filename: __filename
}, async (malvin, mek, m, { from, sender, reply }) => {
  try {
    const prefix = getPrefix();
    const args = m.text.trim().split(/ +/).slice(1);
    if (!args.length) return reply(`Usage: ${prefix}url <long_url>`);

    const longUrl = args[0];
    // Simple shortening using tinyurl API
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
    const shortUrl = response.data;

    await malvin.sendMessage(from, { text: `✅ Shortened URL:\n${shortUrl}` }, { quoted: mek });

  } catch (err) {
    console.error('URL Command Error:', err.message);
    await reply(`❌ Error: Failed to generate URL.\nDetails: ${err.message}`);
  }
});
