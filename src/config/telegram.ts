
// Telegram Bot Configuration
export const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TG_TOKEN;
export const TELEGRAM_CHAT_ID = import.meta.env.VITE_TG_CHAT;

// Validate environment variables at build time
if (!TELEGRAM_BOT_TOKEN) {
  throw new Error('VITE_TG_TOKEN environment variable is required');
}

if (!TELEGRAM_CHAT_ID) {
  throw new Error('VITE_TG_CHAT environment variable is required');
}

console.log('✅ Telegram configuration loaded successfully');
