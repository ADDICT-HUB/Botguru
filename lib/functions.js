const axios = require('axios');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Download file from URL as buffer
const getBuffer = async (url, options = {}) => {
    try {
        const res = await axios({
            method: 'get',
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            responseType: 'arraybuffer',
            ...options
        });
        return res.data;
    } catch (e) {
        console.error('getBuffer Error:', e);
        throw e;
    }
};

// Extract group admins
const getGroupAdmins = (participants) => {
    return participants
        .filter(p => p.admin !== null)
        .map(p => p.id);
};

// Generate random filename or ID
const getRandom = (ext = '') => {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
};

// Human-readable large numbers
const h2k = (num) => {
    const units = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
    const order = Math.floor(Math.log10(Math.abs(num)) / 3);
    if (order === 0) return num.toString();
    const unit = units[order];
    const scaled = num / Math.pow(10, order * 3);
    let formatted = scaled.toFixed(1);
    if (/\.0$/.test(formatted)) formatted = formatted.slice(0, -2);
    return formatted + unit;
};

// Validate URL
const isUrl = (url) => {
    return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)$/i.test(url);
};

// Pretty-print JSON
const Json = (obj) => JSON.stringify(obj, null, 2);

// Runtime in human-readable format
const runtime = (seconds) => {
    seconds = Number(seconds);
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [
        d > 0 ? d + ' day' + (d > 1 ? 's' : '') : null,
        h > 0 ? h + ' hour' + (h > 1 ? 's' : '') : null,
        m > 0 ? m + ' minute' + (m > 1 ? 's' : '') : null,
        s > 0 ? s + ' second' + (s > 1 ? 's' : '') : null
    ].filter(Boolean).join(', ');
};

// Sleep / delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch JSON from URL
const fetchJson = async (url, options = {}) => {
    try {
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        });
        return res.data;
    } catch (err) {
        console.error('fetchJson Error:', err);
        throw err;
    }
};

// Audio Processing Function
const editAudio = async (inputPath, outputPath, options = {}) => {
    return new Promise((resolve, reject) => {
        let cmd = `ffmpeg -i "${inputPath}"`;

        // Apply trimming if start/end provided
        if (options.start) cmd += ` -ss ${options.start}`;
        if (options.end) cmd += ` -to ${options.end}`;

        // Change format if provided
        if (options.format) outputPath = outputPath.endsWith(`.${options.format}`) ? outputPath : `${outputPath}.${options.format}`;

        cmd += ` "${outputPath}" -y`;

        exec(cmd, (error, stdout, stderr) => {
            if (error) return reject(error);
            resolve(outputPath);
        });
    });
};

module.exports = {
    getBuffer,
    getGroupAdmins,
    getRandom,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson,
    editAudio
};
