const TelegramBot = require('node-telegram-bot-api');

// Bot configuration - GUNAKAN TOKEN BOT YANG BERBEDA!
const ADMIN_BOT_TOKEN = '7977269029:AAEs4M8KQ0ByszrhoyqCwL6kDVA4F7ud1K0'; // Ganti dengan token admin bot yang baru
const ADMIN_CHAT_ID = '7833024765';

// Import the main VALID_KEYS array from index.js
const fs = require('fs');
const path = require('path');

// Initialize admin bot
const adminBot = new TelegramBot(ADMIN_BOT_TOKEN, { polling: true });

// Admin commands
const adminCommands = [
    { command: 'start', description: 'Start admin panel' },
    { command: 'addkey', description: 'Add new access key' },
    { command: 'removekey', description: 'Remove access key' },
    { command: 'listkeys', description: 'List all keys' },
    { command: 'sessions', description: 'View active sessions' },
    { command: 'stats', description: 'View system statistics' },
    { command: 'help', description: 'Show admin commands' }
];

// Set bot commands
adminBot.setMyCommands(adminCommands);

// Key management functions
function readValidKeys() {
    try {
        const indexContent = fs.readFileSync(path.join(__dirname, 'index.js'), 'utf8');
        const keysMatch = indexContent.match(/const VALID_KEYS = \[([\s\S]*?)\];/);
        if (keysMatch) {
            const keysString = keysMatch[1];
            const keys = keysString.match(/"([^"]+)"/g);
            return keys ? keys.map(key => key.replace(/"/g, '')) : [];
        }
        return [];
    } catch (error) {
        console.error('Error reading keys:', error);
        return [];
    }
}

function writeValidKeys(keys) {
    try {
        const indexPath = path.join(__dirname, 'index.js');
        let indexContent = fs.readFileSync(indexPath, 'utf8');
        
        const keysArray = keys.map(key => `    "${key}"`).join(',\n');
        const newKeysSection = `const VALID_KEYS = [\n${keysArray}\n];`;
        
        indexContent = indexContent.replace(/const VALID_KEYS = \[[\s\S]*?\];/, newKeysSection);
        
        fs.writeFileSync(indexPath, indexContent, 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing keys:', error);
        return false;
    }
}

// Admin bot message handlers
adminBot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    
    // Check if user is admin
    if (userId !== ADMIN_CHAT_ID) {
        adminBot.sendMessage(chatId, '🚫 <b>Access Denied</b>\n\nAnda tidak memiliki akses ke admin panel ini.', { parse_mode: 'HTML' });
        return;
    }
    
    const messageText = msg.text;
    
    if (messageText === '/start') {
        const welcomeMessage = `
🔐 <b>DuckRAT Admin Panel</b>

Selamat datang di panel admin DuckRAT!
Anda dapat mengelola key akses dan memonitor sistem.

📋 <b>Perintah yang tersedia:</b>
/addkey [key] - Tambah key baru
/removekey [key] - Hapus key
/listkeys - Lihat semua key
/sessions - Lihat session aktif
/stats - Statistik sistem
/help - Bantuan

👤 <b>Admin:</b> @${msg.from.username || 'Unknown'}
📱 <b>Chat ID:</b> <code>${chatId}</code>
        `;
        
        adminBot.sendMessage(chatId, welcomeMessage, {
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: [
                    ['📝 Add Key', '🗑️ Remove Key'],
                    ['📋 List Keys', '👥 Sessions'],
                    ['📊 Statistics', '❓ Help']
                ],
                resize_keyboard: true
            }
        });
    }
    
    else if (messageText === '/help' || messageText === '❓ Help') {
        const helpMessage = `
📖 <b>Admin Panel Help</b>

<b>Key Management:</b>
• <code>/addkey DUCKRAT-2024-PREMIUM-XXX</code>
  Menambah key baru ke sistem
  
• <code>/removekey DUCKRAT-2024-PREMIUM-XXX</code>
  Menghapus key dari sistem
  
• <code>/listkeys</code>
  Menampilkan semua key yang valid

<b>Monitoring:</b>
• <code>/sessions</code>
  Melihat session web dan Telegram yang aktif
  
• <code>/stats</code>
  Statistik sistem dan penggunaan

<b>Format Key:</b>
Gunakan format: DUCKRAT-2024-PREMIUM-XXX
atau format lain sesuai pattern Anda.
        `;
        
        adminBot.sendMessage(chatId, helpMessage, { parse_mode: 'HTML' });
    }
    
    else if (messageText === '/listkeys' || messageText === '📋 List Keys') {
        const keys = readValidKeys();
        
        if (keys.length === 0) {
            adminBot.sendMessage(chatId, '📝 <b>Key Management</b>\n\nTidak ada key yang tersimpan dalam sistem.', { parse_mode: 'HTML' });
            return;
        }
        
        let keyList = '🔑 <b>Valid Access Keys</b>\n\n';
        keys.forEach((key, index) => {
            keyList += `${index + 1}. <code>${key}</code>\n`;
        });
        
        keyList += `\n📊 <b>Total:</b> ${keys.length} keys`;
        
        adminBot.sendMessage(chatId, keyList, { parse_mode: 'HTML' });
    }
    
    else if (messageText === '/stats' || messageText === '📊 Statistics') {
        const keys = readValidKeys();
        const statsMessage = `
📊 <b>System Statistics</b>

🔑 <b>Key Management:</b>
• Total Keys: ${keys.length}
• Key Format: DUCKRAT-2024-PREMIUM-XXX

📱 <b>Bot Information:</b>
• Admin Bot: Active ✅
• Main Panel: Running
• Admin ID: <code>${ADMIN_CHAT_ID}</code>

⚡ <b>Features:</b>
• Real-time key management
• Session monitoring
• Automatic authentication
• Multi-platform support

📅 <b>Last Update:</b> ${new Date().toLocaleString('id-ID')}
        `;
        
        adminBot.sendMessage(chatId, statsMessage, { parse_mode: 'HTML' });
    }
    
    else if (messageText === '📝 Add Key') {
        adminBot.sendMessage(chatId, '🔑 <b>Add New Key</b>\n\nKirim key baru yang ingin ditambahkan.\n\n<b>Format:</b> <code>DUCKRAT-2024-PREMIUM-XXX</code>', {
            parse_mode: 'HTML',
            reply_markup: { force_reply: true }
        });
    }
    
    else if (messageText === '🗑️ Remove Key') {
        const keys = readValidKeys();
        if (keys.length === 0) {
            adminBot.sendMessage(chatId, '❌ Tidak ada key untuk dihapus.', { parse_mode: 'HTML' });
            return;
        }
        
        adminBot.sendMessage(chatId, '🗑️ <b>Remove Key</b>\n\nKirim key yang ingin dihapus.\n\nGunakan /listkeys untuk melihat key yang tersedia.', {
            parse_mode: 'HTML',
            reply_markup: { force_reply: true }
        });
    }
    
    else if (messageText === '👥 Sessions') {
        adminBot.sendMessage(chatId, '👥 <b>Active Sessions</b>\n\nFitur ini akan menampilkan session yang aktif dari main panel.\n\n⚠️ Untuk melihat session real-time, gunakan command di main bot panel.', { parse_mode: 'HTML' });
    }
    
    // Handle reply messages for adding/removing keys
    else if (msg.reply_to_message) {
        if (msg.reply_to_message.text.includes('Add New Key')) {
            const newKey = messageText.trim();
            
            if (!newKey) {
                adminBot.sendMessage(chatId, '❌ Key tidak boleh kosong!', { parse_mode: 'HTML' });
                return;
            }
            
            const keys = readValidKeys();
            
            if (keys.includes(newKey)) {
                adminBot.sendMessage(chatId, `❌ <b>Key sudah ada!</b>\n\nKey <code>${newKey}</code> sudah terdaftar dalam sistem.`, { parse_mode: 'HTML' });
                return;
            }
            
            keys.push(newKey);
            
            if (writeValidKeys(keys)) {
                adminBot.sendMessage(chatId, `✅ <b>Key berhasil ditambahkan!</b>\n\n🔑 Key: <code>${newKey}</code>\n📊 Total keys: ${keys.length}`, { parse_mode: 'HTML' });
                
                // Log activity
                console.log(`[ADMIN] Key added: ${newKey} by ${msg.from.username}`);
            } else {
                adminBot.sendMessage(chatId, '❌ <b>Error!</b>\n\nGagal menambahkan key. Coba lagi.', { parse_mode: 'HTML' });
            }
        }
        
        else if (msg.reply_to_message.text.includes('Remove Key')) {
            const keyToRemove = messageText.trim();
            
            if (!keyToRemove) {
                adminBot.sendMessage(chatId, '❌ Key tidak boleh kosong!', { parse_mode: 'HTML' });
                return;
            }
            
            const keys = readValidKeys();
            const keyIndex = keys.indexOf(keyToRemove);
            
            if (keyIndex === -1) {
                adminBot.sendMessage(chatId, `❌ <b>Key tidak ditemukan!</b>\n\nKey <code>${keyToRemove}</code> tidak ada dalam sistem.`, { parse_mode: 'HTML' });
                return;
            }
            
            keys.splice(keyIndex, 1);
            
            if (writeValidKeys(keys)) {
                adminBot.sendMessage(chatId, `✅ <b>Key berhasil dihapus!</b>\n\n🗑️ Key: <code>${keyToRemove}</code>\n📊 Total keys: ${keys.length}`, { parse_mode: 'HTML' });
                
                // Log activity
                console.log(`[ADMIN] Key removed: ${keyToRemove} by ${msg.from.username}`);
            } else {
                adminBot.sendMessage(chatId, '❌ <b>Error!</b>\n\nGagal menghapus key. Coba lagi.', { parse_mode: 'HTML' });
            }
        }
    }
    
    // Handle /addkey command with parameter
    else if (messageText.startsWith('/addkey ')) {
        const newKey = messageText.replace('/addkey ', '').trim();
        
        if (!newKey) {
            adminBot.sendMessage(chatId, '❌ <b>Format salah!</b>\n\nGunakan: <code>/addkey YOUR_KEY</code>', { parse_mode: 'HTML' });
            return;
        }
        
        const keys = readValidKeys();
        
        if (keys.includes(newKey)) {
            adminBot.sendMessage(chatId, `❌ <b>Key sudah ada!</b>\n\nKey <code>${newKey}</code> sudah terdaftar.`, { parse_mode: 'HTML' });
            return;
        }
        
        keys.push(newKey);
        
        if (writeValidKeys(keys)) {
            adminBot.sendMessage(chatId, `✅ <b>Key berhasil ditambahkan!</b>\n\n🔑 Key: <code>${newKey}</code>\n📊 Total keys: ${keys.length}`, { parse_mode: 'HTML' });
        } else {
            adminBot.sendMessage(chatId, '❌ Gagal menambahkan key. Coba lagi.', { parse_mode: 'HTML' });
        }
    }
    
    // Handle /removekey command with parameter
    else if (messageText.startsWith('/removekey ')) {
        const keyToRemove = messageText.replace('/removekey ', '').trim();
        
        if (!keyToRemove) {
            adminBot.sendMessage(chatId, '❌ <b>Format salah!</b>\n\nGunakan: <code>/removekey YOUR_KEY</code>', { parse_mode: 'HTML' });
            return;
        }
        
        const keys = readValidKeys();
        const keyIndex = keys.indexOf(keyToRemove);
        
        if (keyIndex === -1) {
            adminBot.sendMessage(chatId, `❌ <b>Key tidak ditemukan!</b>\n\nKey <code>${keyToRemove}</code> tidak ada.`, { parse_mode: 'HTML' });
            return;
        }
        
        keys.splice(keyIndex, 1);
        
        if (writeValidKeys(keys)) {
            adminBot.sendMessage(chatId, `✅ <b>Key berhasil dihapus!</b>\n\n🗑️ Key: <code>${keyToRemove}</code>\n📊 Total keys: ${keys.length}`, { parse_mode: 'HTML' });
        } else {
            adminBot.sendMessage(chatId, '❌ Gagal menghapus key. Coba lagi.', { parse_mode: 'HTML' });
        }
    }
});

// Enhanced error handling
adminBot.on('error', (error) => {
    console.error('[ADMIN BOT] Error:', error.message);
    // Auto-restart on critical errors
    if (error.code === 'EFATAL') {
        console.log('[ADMIN BOT] Attempting to restart polling...');
        setTimeout(() => {
            adminBot.stopPolling();
            adminBot.startPolling();
        }, 5000);
    }
});

adminBot.on('polling_error', (error) => {
    if (error.code === 'EFATAL' || error.code === 'ECONNRESET') {
        console.log('[ADMIN BOT] Connection lost, retrying...');
    } else {
        console.error('[ADMIN BOT] Polling error:', error.message);
    }
});

// Start message
console.log('🔐 Admin Bot started successfully!');
console.log(`📱 Admin Chat ID: ${ADMIN_CHAT_ID}`);

// Auto-start if this file is run directly
if (require.main === module) {
    console.log('🤖 Admin Bot running as standalone process');
} else {
    console.log('🔗 Admin Bot integrated with main server');
}

module.exports = adminBot;
