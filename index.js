const fs = require('fs');
const vCard = require('vcf');

function extractVCFContacts(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const cards = vCard.parse(raw);
  return cards.map(card => {
    const tel = card.get('tel');
    return tel ? tel.value.replace(/\D/g, '') + "@s.whatsapp.net" : null;
  }).filter(Boolean);
}
