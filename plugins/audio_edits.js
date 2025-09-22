const fs = require('fs');
const { getBuffer, downloadMediaMessage } = require('../lib/msg');

module.exports = {
    name: 'audioEdit',
    description: 'Process audio from URL or WhatsApp media',

    run: async (bot, m, args) => {
        try {
            let buffer;

            // Case 1: Media in WhatsApp message (audio, voice note, document)
            if (m.msg?.audioMessage || m.msg?.voiceMessage || m.msg?.documentMessage) {
                buffer = await downloadMediaMessage(m.msg);
            } 
            // Case 2: URL provided
            else if (args[0] && /^https?:\/\//.test(args[0])) {
                buffer = await getBuffer(args[0]);
            } 
            else {
                return m.reply('⚠️ Please send an audio message or provide a valid audio URL.');
            }

            // Save temporarily
            if (!fs.existsSync('./temp')) fs.mkdirSync('./temp');
            const fileName = `audio_${Date.now()}.mp3`;
            const filePath = `./temp/${fileName}`;
            fs.writeFileSync(filePath, buffer);

            // Send audio back to WhatsApp
            await bot.sendMessage(m.chat, { audio: fs.readFileSync(filePath), mimetype: 'audio/mp3' }, { quoted: m });

            // Delete temp file
            fs.unlinkSync(filePath);

        } catch (err) {
            console.error('Audio Edit Error:', err);
            m.reply('❌ Failed to process audio.');
        }
    }
};
