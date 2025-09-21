const config = require('../settings');
const { malvin } = require('../malvin');

malvin({
    pattern: "menu",
    alias: ["list", "commands"],
    desc: "Show bot main menu with categories",
    category: "menu",
    react: "⚡",
    filename: __filename
}, async (malvin, mek, m, { from }) => {
    try {
        const intro = `
⚡ *BOT GURU* ⚡
Select a category below to view its commands.
${config.DESCRIPTION || ""}
        `.trim();

        await malvin.sendMessage(
            from,
            {
                image: { url: "https://url.bwmxmd.online/Adams.h0gop5c7.jpeg" },
                caption: intro,
                footer: "⚡ Bot Guru Categories",
                buttons: [
                    { buttonId: '.menu_download', buttonText: { displayText: '📥 Download' }, type: 1 },
                    { buttonId: '.menu_anime', buttonText: { displayText: '🌸 Anime' }, type: 1 },
                    { buttonId: '.menu_info', buttonText: { displayText: 'ℹ️ Info' }, type: 1 },
                    { buttonId: '.menu_group', buttonText: { displayText: '👥 Group' }, type: 1 },
                    { buttonId: '.menu_owner', buttonText: { displayText: '👑 Owner' }, type: 1 },
                    { buttonId: '.menu_convert', buttonText: { displayText: '🔄 Convert' }, type: 1 },
                    { buttonId: '.menu_other', buttonText: { displayText: '🎲 Other' }, type: 1 }
                ],
                headerType: 4
            },
            { quoted: mek }
        );
    } catch (e) {
        console.error(e);
        malvin.sendMessage(from, { text: `❌ Error: ${e.message || e}` }, { quoted: mek });
    }
});
