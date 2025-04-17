const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const qrcode = require("qrcode-terminal");

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update;
    if (qr) {
      console.log("SCAN THIS QR");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("WhatsApp Connected!");
    }

    if (connection === "close") {
      const shouldReconnect = (update.lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        startSock();
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

startSock();
