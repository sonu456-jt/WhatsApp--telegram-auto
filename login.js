
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (update) => {
    const { connection } = update;
    if (connection === "open") console.log("✅ WhatsApp connected.");
  });
}
connect();
