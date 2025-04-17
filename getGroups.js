
const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function listGroups() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const sock = makeWASocket({ auth: state });

  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") console.log("✅ WhatsApp connected.");
  });

  sock.ev.on("chats.set", async () => {
    const groups = sock.chats.all().filter(chat => chat.id.endsWith("@g.us"));
    groups.forEach(g => {
      console.log(`Group: ${g.name} → JID: ${g.id}`);
    });
    process.exit();
  });
}
listGroups();
