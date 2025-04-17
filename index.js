
const fs = require('fs');
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const TelegramBot = require('node-telegram-bot-api');
const vCardParser = require('vcard-parser');
const axios = require('axios');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, { polling: true });

let dynamicGroupJID = "";

async function startWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({ auth: state });
    sock.ev.on('creds.update', saveCreds);
    return sock;
}

function extractVCFContacts(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const parsed = vCardParser.parse(data);
    return parsed.map(entry => entry.tel.value.replace(/\D/g, '') + "@s.whatsapp.net");
}

async function handleVCF(sock, filePath, groupJid, chatId) {
    const contacts = extractVCFContacts(filePath);
    bot.sendMessage(chatId, `Total ${contacts.length} contacts found. Starting add process...`);
    for (let contact of contacts) {
        try {
            await sock.groupParticipantsUpdate(groupJid, [contact], "add");
            await bot.sendMessage(chatId, `✅ Added: +${contact.replace("@s.whatsapp.net", "")}`);
        } catch (e) {
            await bot.sendMessage(chatId, `❌ Failed: +${contact.replace("@s.whatsapp.net", "")}`);
        }
        await new Promise(res => setTimeout(res, 1000));
    }
    bot.sendMessage(chatId, "All done!");
}

async function main() {
    const sock = await startWhatsApp();

    bot.onText(/\/setgroup (.+)/, (msg, match) => {
        dynamicGroupJID = match[1].trim();
        bot.sendMessage(msg.chat.id, `✅ Group JID set to: ${dynamicGroupJID}`);
    });

    bot.on('document', async (msg) => {
        if (!dynamicGroupJID) {
            return bot.sendMessage(msg.chat.id, "⚠️ Please set group JID using /setgroup <jid>");
        }

        const file = await bot.getFileLink(msg.document.file_id);
        const filePath = '/tmp/' + msg.document.file_name;

        const res = await axios.get(file.href, { responseType: 'arraybuffer' });
        fs.writeFileSync(filePath, res.data);

        await handleVCF(sock, filePath, dynamicGroupJID, msg.chat.id);
    });
}

main();
