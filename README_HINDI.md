
# WhatsApp Telegram Automation System (VCF Based)

## इस्तेमाल कैसे करें:

1. सबसे पहले `npm install` चलाएं
2. फिर WhatsApp QR login के लिए:
   ```
   npm run login
   ```
3. Group JID जानने के लिए:
   ```
   npm run getgroups
   ```
4. फिर Telegram bot पर ये भेजें:
   ```
   /setgroup 1203xxxxx@g.us
   ```
5. फिर Telegram पर `.vcf` फाइल भेजें — सारे contacts group में add हो जाएंगे।
