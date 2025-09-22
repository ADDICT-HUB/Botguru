/*
🔧 Project      : MALVIN-XD
👑 Creator      : Malvin King (Mr. Lord Malvin)
📦 Repository   : https://github.com/XdKing2/MALVIN-XD
📞 Support      : https://wa.me/263714757857
*/

const { malvin } = require('../malvin');
const config = require('../settings');

malvin({
  pattern: "owner",
  react: "📞",
  desc: "Send bot owner's contact",
  category: "main",
  filename: __filename
}, async (malvin, mek, m, { from, reply }) => {
  try {
    const ownerName = config.OWNER_NAME || "Guru";
    const ownerNumber = config.OWNER_NUMBER || "254116284050";

    // Build vCard contact
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${ownerName}`,
      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}`,
      "END:VCARD"
    ].join('\n');

    // Send vCard contact
    await malvin.sendMessage(from, {
      contacts: {
        displayName: ownerName,
        contacts: [{ vcard }]
      }
    });

    // Send image + redesigned caption
    await malvin.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/vshhlt.jpg' },
      caption: `
╔══════════════════════╗
        ⚡ BOT GURU ⚡
╚══════════════════════╝

👑 *Owner*    : ${ownerName}  
📞 *Contact*  : ${ownerNumber}  
⚡ *Version*  : ${config.version || 'Unknown'}  

━━━━━━━━━━━━━━━━━━━━━━━
💡 *Need Help?*  
➤ Contact the owner directly  
➤ Support for bot setup  
➤ Custom requests available  

> ⚡ 🇰🇪Powered by *GURU*  
      💀🇰🇪 *Forever Respected*  
`.trim(),
      contextInfo: {
        mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363419810795263@newsletter',
          newsletterName: 'its guru',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (error) {
    console.error("❌ Error in .owner command:", error);
    reply(`⚠️ An error occurred: ${error.message}`);
  }
});
