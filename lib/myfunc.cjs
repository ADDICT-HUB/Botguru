const axios = require('axios');
const fs = require('fs');

// ===================
// General Utilities
// ===================
const getBuffer = async(url, options) => {
    try {
        options = options || {};
        const res = await axios({
            method: 'get',
            url,
            headers: { 'DNT': 1, 'Upgrade-Insecure-Request': 1 },
            ...options,
            responseType: 'arraybuffer'
        });
        return res.data;
    } catch (e) {
        console.log(e);
    }
};

const fetchJson = async(url, options) => {
    try {
        options = options || {};
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            ...options
        });
        return res.data;
    } catch (err) {
        return err;
    }
};

const sleep = async(ms) => new Promise(resolve => setTimeout(resolve, ms));

const getRandom = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`;

const h2k = (num) => {
    const units = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
    const i = Math.floor(Math.log10(Math.abs(num)) / 3);
    if (i === 0) return num.toString();
    return (num / Math.pow(10, i * 3)).toFixed(1).replace(/\.0$/, '') + units[i];
};

const isUrl = (url) => !!url.match(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/gi
);

const Json = (obj) => JSON.stringify(obj, null, 2);

const runtime = (seconds) => {
    seconds = Number(seconds);
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d ? d + ' days, ' : ''}${h ? h + ' hours, ' : ''}${m ? m + ' minutes, ' : ''}${s ? s + ' seconds' : ''}`;
};

// ===================
// Group Utilities
// ===================
const getGroupAdmins = (participants) => {
    return participants.filter(p => p.admin !== null).map(p => p.id);
};

// ===================
// Audio Stub
// ===================
// This prevents audio_edit.js from crashing.
// You can later replace this with actual audio functions.
const processAudio = async(filePath) => {
    console.log(`Audio processing stub for file: ${filePath}`);
    return true;
};

// ===================
// Export
// ===================
module.exports = {
    getBuffer,
    fetchJson,
    sleep,
    getRandom,
    h2k,
    isUrl,
    Json,
    runtime,
    getGroupAdmins,
    processAudio
};
