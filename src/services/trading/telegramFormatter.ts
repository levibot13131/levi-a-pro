
import { TradingSignal } from './liveSignalEngine';

export class TelegramFormatter {
  static formatSignal(signal: TradingSignal): string {
    const emoji = signal.action === 'BUY' ? '🟢' : '🔴';
    const action = signal.action === 'BUY' ? 'קנייה' : 'מכירה';
    
    return `
🚀 *LeviPro LIVE Signal* ${emoji}

*${action} ${signal.symbol}*
💰 מחיר כניסה: $${signal.price.toLocaleString()}
🎯 יעד: $${signal.targetPrice.toLocaleString()}
🛡️ סטופ לוס: $${signal.stopLoss.toLocaleString()}

⚡ *ביטחון: ${signal.confidence}%*
📊 יחס R/R: ${signal.riskRewardRatio.toFixed(2)}
🧠 רציונל: ${signal.reasoning}

⏰ זמן: ${new Date().toLocaleString('he-IL')}
📈 תבנית: ${signal.strategy}
${signal.sentimentScore ? `📱 סנטימנט: ${(signal.sentimentScore * 100).toFixed(0)}%` : ''}
${signal.volumeSpike ? '🌊 זינוק נפח זוהה' : ''}

*🔥 LeviPro v1.0 - Live Intelligence*
    `;
  }

  static formatTestSignal(): string {
    return `
🧪 *LeviPro Test Signal* 🔥

*קנייה BTCUSDT*
💰 מחיר כניסה: $102,500
🎯 יעד: $105,125
🛡️ סטופ לוס: $101,475

⚡ *ביטחון: 95%*
📊 יחס R/R: 2.5
🧠 רציונל: TEST: Multi-timeframe bullish confluence + positive sentiment + volume spike detected

⏰ זמן: ${new Date().toLocaleString('he-IL')}
📈 תבנית: Enhanced Intelligence Test
📱 סנטימנט: 75%
🌊 זינוק נפח זוהה
🐋 פעילות לווייתנים זוהתה

*🔥 LeviPro v1.0 - Test Complete*
    `;
  }
}
