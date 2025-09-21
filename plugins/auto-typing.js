const config = require('../settings');
const { malvin } = require('../malvin');

malvin({
    on: "body"
}, async (bot, mek, m, { from }) => {
    if (config.AUTO_TYPING === 'true' || config.AUTO_TYPING === true) {
        // Show typing for a short time each time a message is received
        await bot.sendPresenceUpdate('composing', from);
    }
});
