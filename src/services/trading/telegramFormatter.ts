
interface TradingSignal {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  price: number;
  targetPrice: number;
  stopLoss: number;
  confidence: number;
  riskRewardRatio: number;
  reasoning: string;
  timestamp: number;
  timeframe: string;
  strategy: string;
  sentimentScore?: number;
  whaleActivity?: boolean;
  volumeSpike?: boolean;
}

export class TelegramFormatter {
  static formatSignal(signal: TradingSignal): string {
    const emoji = signal.action === 'BUY' ? '🟢' : '🔴';
    const action = signal.action === 'BUY' ? 'קנייה' : 'מכירה';
    
    return `${emoji} *אות ${action} - LeviPro*

💰 *${signal.symbol}*
📈 מחיר כניסה: $${signal.price.toFixed(2)}
🎯 מטרה: $${signal.targetPrice.toFixed(2)}
🛡️ סטופ לוס: $${signal.stopLoss.toFixed(2)}

📊 *פרמטרים:*
• רמת ביטחון: ${signal.confidence}%
• יחס סיכון/רווח: ${signal.riskRewardRatio.toFixed(2)}
• אסטרטגיה: ${signal.strategy}
• מסגרת זמן: ${signal.timeframe}

${signal.sentimentScore ? `📰 ניתוח סנטימנט: ${(signal.sentimentScore * 100).toFixed(0)}%` : ''}
${signal.volumeSpike ? '🌊 זינוק בנפח מסחר זוהה' : ''}
${signal.whaleActivity ? '🐋 פעילות לווייתנים' : ''}

📝 *נימוק:* ${signal.reasoning}

⏰ ${new Date(signal.timestamp).toLocaleString('he-IL')}

_הודעה אוטומטית מ-LeviPro AI_`;
  }

  static formatTestSignal(): string {
    return `🧪 *בדיקת מערכת - LeviPro*

✅ *מערכת פעילה ותקינה*

📊 *סטטוס רכיבים:*
• מנוע אותות: פעיל
• ניתוח נתונים: פעיל  
• API חיצוניים: מחוברים
• מסנני איכות: פעילים

🎯 *הגדרות מסנן:*
• רמת ביטחון מינימלית: 80%
• יחס סיכון/רווח מינימלי: 1.5
• הגבלה יומית: 10 אותות
• הגבלה לסשן: 3 אותות

⏰ ${new Date().toLocaleString('he-IL')}

_בדיקת תקינות אוטומטית_`;
  }
}
