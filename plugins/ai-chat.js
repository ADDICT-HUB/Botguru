const { malvin } = require('../malvin');
const axios = require('axios');

// In-memory conversation history
const conversationMemory = new Map();

// Save user/AI messages
function updateMemory(userId, role, content) {
  if (!conversationMemory.has(userId)) conversationMemory.set(userId, []);
  const mem = conversationMemory.get(userId);
  mem.push({ role, content });
  if (mem.length > 30) mem.shift(); // keep last 30 only
}

// Retrieve context for prompt
function getContext(userId) {
  if (!conversationMemory.has(userId)) return '';
  return conversationMemory
    .get(userId)
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');
}

// Filters
const abusiveWords = ['stupid','idiot','dumb','fool','shit','fuck','asshole','bitch'];
const greetings = ['hi','hello','hey','good morning','good afternoon','good evening'];

function isAbusive(text) {
  return abusiveWords.some(w => text.toLowerCase().includes(w));
}
function isGreeting(text) {
  return greetings.some(g => text.toLowerCase().includes(g));
}

// New newsletter ID + name
const NEWSLETTER = {
  newsletterJid: '120363999999999999@newsletter',   // 🔑 <- replace with your NEW ID
  newsletterName: 'BOT GURU',
  serverMessageId: 143
};

malvin({
  pattern: 'marisel',
  alias: ['ds','deepseek'],
  desc: 'Ask Marisel AI a question',
  category: 'ai',
  react: '🤖',
  filename: __filename
}, async (bot, mek, m, { from, args, q, reply, react: doReact }) => {

  const query = q || args.join(' ').trim();
  if (!query) {
    return bot.sendMessage(from, {
      text: 'Please ask something like `.marisel what is free will?`',
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: mek });
  }

  if (isAbusive(query))
    return bot.sendMessage(from, {
      text: "*⚠️ Please be respectful. No abusive language.*",
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: mek });

  if (isGreeting(query))
    return bot.sendMessage(from, {
      text: "*Hello! 👋 How may Marisel AI assist you today?*",
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: mek });

  const qLower = query.toLowerCase();
  if (/(who made you|who created you|who is your owner|who developed you|who are you|what are you|who is marisel)/.test(qLower)) {
    return bot.sendMessage(from, {
      text: `*About Me:*\n\nI am *Marisel AI*, created by *Marisel* from Kenya.\nI belong to the BOT GURU family of intelligent WhatsApp bots.\n\n> How may I assist you today?`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: NEWSLETTER
      }
    }, { quoted: mek });
  }

  if (/(language model|llm|what model)/.test(qLower)) {
    return bot.sendMessage(from, {
      text: "*I use multiple advanced language models to generate responses—always learning to serve you better!*",
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: mek });
  }

  updateMemory(m.sender, 'user', query);

  const personality = `
You are Marisel AI — an intelligent, friendly assistant. 
Provide detailed, helpful answers while keeping context:
${getContext(m.sender)}
  `;

  try {
    // Primary: Gifted Groq
    const groqUrl = `https://api.giftedtech.web.id/api/ai/groq-beta?apikey=gifted&q=${encodeURIComponent(personality + "\n\nUser: " + query)}`;
    const groqRes = await axios.get(groqUrl);
    let response = groqRes.data?.result || groqRes.data?.response || '';

    // Fallback: DeepSeek
    if (!response) {
      const deepseekUrl = `https://api.nekorinn.my.id/ai/deepseek-r1?text=${encodeURIComponent(personality + "\n\nUser: " + query)}`;
      const deepseekRes = await axios.get(deepseekUrl);
      response = deepseekRes.data?.result?.text || "I couldn't generate a response at the moment.";
    }

    updateMemory(m.sender, 'assistant', response);

    // Add a follow-up to keep conversation flowing
    if (!/[?]$/.test(response)) {
      const followUps = [
        "\n\nWould you like me to elaborate on this?",
        "\n\nIs there anything else you'd like to know?",
        "\n\nShall I provide more technical details?"
      ];
      response += followUps[Math.floor(Math.random() * followUps.length)];
    }

    await bot.sendMessage(from, {
      text: `*Marisel AI says:*\n\n${response}\n\n> _Powered by BOT GURU AI_`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: NEWSLETTER
      }
    }, { quoted: mek });

    await doReact('✅');

  } catch (err) {
    console.error('AI Error:', err);
    await bot.sendMessage(from, {
      text: `❌ *AI Error*:\n${err.message}`,
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: mek });
    await doReact('❌');
  }
});
