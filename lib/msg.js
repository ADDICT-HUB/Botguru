const config = require('../settings');
const { proto, downloadContentFromMessage, getContentType } = require(config.BAILEYS);
const fs = require('fs');

const downloadMediaMessage = async (m, filename) => {
    if (m.type === 'viewOnceMessage') m.type = m.msg.type;

    const download = async (type, ext) => {
        const name = filename ? `${filename}.${ext}` : `undefined.${ext}`;
        const stream = await downloadContentFromMessage(m.msg, type);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        fs.writeFileSync(name, buffer);
        return fs.readFileSync(name);
    };

    switch (m.type) {
        case 'imageMessage': return await download('image', 'jpg');
        case 'videoMessage': return await download('video', 'mp4');
        case 'audioMessage': return await download('audio', 'mp3');
        case 'stickerMessage': return await download('sticker', 'webp');
        case 'documentMessage': {
            let ext = m.msg?.fileName?.split('.').pop().toLowerCase() || 'bin';
            ext = ext.replace('jpeg', 'jpg').replace('png', 'jpg').replace('m4a', 'mp3');
            return await download('document', ext);
        }
        default: return null;
    }
};

const sms = (malvin, m, store) => {
    if (!m) return null;

    const M = proto.WebMessageInfo;

    // Safely populate key info
    if (m.key) {
        m.id = m.key.id || '';
        m.isBot = m.id.startsWith('BAES') && m.id.length === 16;
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
        m.chat = m.key.remoteJid || '';
        m.fromMe = m.key.fromMe || false;
        m.isGroup = m.chat?.endsWith('@g.us');
        m.sender = m.fromMe ? (malvin.user?.id?.split(':')[0] + '@s.whatsapp.net') : (m.isGroup ? m.key.participant : m.key.remoteJid);
    }

    // Safely get message type and content
    m.mtype = m.message ? getContentType(m.message) : null;
    m.msg = m.message && m.mtype
        ? (m.mtype === 'viewOnceMessage'
            ? m.message[m.mtype]?.message?.[getContentType(m.message[m.mtype].message)] || {}
            : m.message[m.mtype] || {}
        )
        : {};

    // Safely extract body
    try {
        if (!m.message) m.body = '';
        else if (m.mtype === 'conversation') m.body = m.message.conversation || '';
        else if (m.mtype === 'imageMessage') m.body = m.message.imageMessage?.caption || '';
        else if (m.mtype === 'videoMessage') m.body = m.message.videoMessage?.caption || '';
        else if (m.mtype === 'extendedTextMessage') m.body = m.message.extendedTextMessage?.text || '';
        else if (m.mtype === 'buttonsResponseMessage') m.body = m.message.buttonsResponseMessage?.selectedButtonId || '';
        else if (m.mtype === 'listResponseMessage') m.body = m.message.listResponseMessage?.singleSelectReply?.selectedRowId || '';
        else if (m.mtype === 'templateButtonReplyMessage') m.body = m.message.templateButtonReplyMessage?.selectedId || '';
        else if (m.mtype === 'messageContextInfo') {
            m.body = m.message.buttonsResponseMessage?.selectedButtonId
                || m.message.listResponseMessage?.singleSelectReply?.selectedRowId
                || m.text || '';
        } else m.body = '';
    } catch {
        m.body = '';
    }

    // Safely extract contextInfo and quoted
    const contextInfo = m.msg?.contextInfo || {};
    const quoted = contextInfo?.quotedMessage || null;
    m.quoted = quoted;
    m.mentionedJid = contextInfo?.mentionedJid || [];

    if (m.quoted) {
        try {
            const type = getContentType(m.quoted) || '';
            m.quoted.mtype = type;
            m.quoted.id = contextInfo?.stanzaId || '';
            m.quoted.chat = contextInfo?.remoteJid || m.chat;
            m.quoted.isBot = m.quoted.id?.startsWith('BAES') && m.quoted.id.length === 16;
            m.quoted.isBaileys = m.quoted.id?.startsWith('BAE5') && m.quoted.id.length === 16;
            m.quoted.sender = malvin.decodeJid(contextInfo?.participant) || m.sender;
            m.quoted.fromMe = m.quoted.sender === malvin.user?.id;
            m.quoted.text = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || '';
            m.quoted.mentionedJid = contextInfo?.mentionedJid || [];

            const vM = m.quoted.fakeObj = M.fromObject({
                key: { remoteJid: m.quoted.chat, fromMe: m.quoted.fromMe, id: m.quoted.id },
                message: quoted,
                ...(m.isGroup ? { participant: m.quoted.sender } : {})
            });

            m.quoted.delete = async () => {
                if (!m.quoted.id) return false;
                await malvin.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.quoted.id, participant: m.quoted.sender } });
            };

            m.forwardMessage = (jid, forceForward = true, options = {}) => malvin.copyNForward(jid, vM, forceForward, { contextInfo: { isForwarded: false } }, options);
            m.quoted.download = () => m.quoted.id ? malvin.downloadMediaMessage(m.quoted) : null;
        } catch (err) {
            console.log('Error handling quoted message:', err);
        }
    }

    if (m.msg?.url) m.download = () => malvin.downloadMediaMessage(m.msg);

    m.text = m.msg?.text || m.msg?.caption || m.message?.conversation || m.msg?.contentText || m.msg?.selectedDisplayText || m.msg?.title || '';

    // Reply helper
    m.reply = async (content, opt = { packname: "Secktor", author: "SamPandey001" }, type = "text") => {
        if (!m.chat) return;
        switch (type.toLowerCase()) {
            case 'text': return await malvin.sendMessage(m.chat, { text: content }, { quoted: m });
            case 'image': return await malvin.sendMessage(m.chat, Buffer.isBuffer(content) ? { image: content, ...opt } : { image: { url: content }, ...opt }, { quoted: m });
            case 'video': return await malvin.sendMessage(m.chat, Buffer.isBuffer(content) ? { video: content, ...opt } : { video: { url: content }, ...opt }, { quoted: m });
            case 'audio': return await malvin.sendMessage(m.chat, Buffer.isBuffer(content) ? { audio: content, ...opt } : { audio: { url: content }, ...opt }, { quoted: m });
        }
    };

    return m;
};

module.exports = { sms, downloadMediaMessage };
