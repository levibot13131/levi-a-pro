
interface TradingSignal {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  price: number;
  targetPrice: number;
  prePrimaryTarget?: number;  // מטרה טרום ראשונית
  primaryTarget?: number;     // מטרה ראשונה  
  mainTarget?: number;        // מטרה עיקרית
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
  killZone?: number;          // איזור הרג
  setupDescription?: string;   // תיאור הסטאפ
  entryLogic?: string;        // לוגיקת הכניסה
  managementRules?: string[]; // כללי ניהול
}

export class TelegramFormatter {
  static formatSignal(signal: TradingSignal): string {
    const emoji = signal.action === 'BUY' ? '🟢' : '🔴';
    const action = signal.action === 'BUY' ? 'קנייה' : 'מכירה';
    
    // בניית מטרות מפורטות
    let targetsSection = '';
    if (signal.prePrimaryTarget || signal.primaryTarget || signal.mainTarget) {
      targetsSection = `
🎯 *מטרות מפורטות:*`;
      
      if (signal.prePrimaryTarget) {
        targetsSection += `
• מטרה טרום ראשונית: $${signal.prePrimaryTarget.toFixed(2)}`;
      }
      
      if (signal.primaryTarget) {
        targetsSection += `
• מטרה ראשונה: $${signal.primaryTarget.toFixed(2)}`;
      }
      
      if (signal.mainTarget) {
        targetsSection += `
• מטרה עיקרית: $${signal.mainTarget.toFixed(2)}`;
      }
    } else {
      targetsSection = `
🎯 מטרה: $${signal.targetPrice.toFixed(2)}`;
    }

    // בניית תיאור הסטאפ והניהול
    let ksemSection = '';
    if (signal.killZone || signal.setupDescription || signal.entryLogic || signal.managementRules) {
      ksemSection = `
📋 *KSEM Analysis:*`;
      
      if (signal.killZone) {
        ksemSection += `
🔥 Kill Zone: $${signal.killZone.toFixed(2)}`;
      }
      
      if (signal.setupDescription) {
        ksemSection += `
⚙️ Setup: ${signal.setupDescription}`;
      }
      
      if (signal.entryLogic) {
        ksemSection += `
🚪 Entry: ${signal.entryLogic}`;
      }
      
      if (signal.managementRules && signal.managementRules.length > 0) {
        ksemSection += `
🎛️ Management:`;
        signal.managementRules.forEach(rule => {
          ksemSection += `
  • ${rule}`;
        });
      }
    }
    
    return `${emoji} *אות ${action} - LeviPro*

💰 *${signal.symbol}*
📈 מחיר כניסה: $${signal.price.toFixed(2)}${targetsSection}
🛡️ סטופ לוס: $${signal.stopLoss.toFixed(2)}${ksemSection}

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
