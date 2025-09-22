const fs = require('fs');
const myfunc = require('../lib/myfunc.cjs');

module.exports = async (malvin, m) => {
    try {
        // Only continue if there’s audio or a voice note
        if (!m.msg || (!m.msg.audioMessage && !m.msg.voiceMessage)) return;

        // Download the audio
        const audioBuffer = await malvin.downloadMediaMessage(m.msg);
        const timestamp = Date.now();
        const inputFile = `./temp_${timestamp}.ogg`; // downloaded audio
        const outputFile = `./converted_${timestamp}.mp3`; // converted MP3

        fs.writeFileSync(inputFile, audioBuffer);

        // Convert to MP3 using myfunc
        await myfunc.convertToMp3(inputFile, outputFile);

        // Send converted audio back to chat
        await malvin.sendMessage(
            m.chat,
            { audio: fs.readFileSync(outputFile), mimetype: 'audio/mpeg' },
            { quoted: m }
        );

        // Cleanup temp files
        fs.unlinkSync(inputFile);
        fs.unlinkSync(outputFile);

    } catch (err) {
        console.log('[Audio Edit Error]', err);
    }
};
