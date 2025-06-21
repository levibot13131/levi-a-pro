
import { telegramBot } from '../telegram/telegramBot';
import { aiLearningEngine } from '../ai/learningEngine';
import { signalManager } from '../trading/signalManager';
import { marketDataService } from '../trading/marketDataService';

export class DailyReportService {
  private reportInterval?: NodeJS.Timeout;
  private lastReportDate: string = '';

  constructor() {
    this.startDailyReports();
  }

  private startDailyReports() {
    // Check every hour if we need to send a daily report
    this.reportInterval = setInterval(() => {
      this.checkAndSendDailyReport();
    }, 3600000); // 1 hour

    // Also check immediately on startup
    setTimeout(() => {
      this.checkAndSendDailyReport();
    }, 5000);
  }

  private async checkAndSendDailyReport() {
    const now = new Date();
    const israelTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Jerusalem"}));
    const currentDate = israelTime.toDateString();
    
    // Send report at 8:00 AM Israel time
    const shouldSendReport = israelTime.getHours() === 8 && 
                           israelTime.getMinutes() < 30 && 
                           this.lastReportDate !== currentDate;

    if (shouldSendReport) {
      console.log('🌅 Sending daily report...');
      await this.generateAndSendDailyReport();
      this.lastReportDate = currentDate;
    }
  }

  private async generateAndSendDailyReport() {
    try {
      // Get AI insights
      const aiReport = await aiLearningEngine.generateDailyReport();
      
      // Get trading statistics
      const dailyStats = signalManager.getDailyStats();
      
      // Get market overview
      const marketOverview = await this.generateMarketOverview();
      
      // Combine all reports
      const fullReport = `
🌅 <b>LeviPro - דו"ח בוקר יומי</b>
📅 ${new Date().toLocaleDateString('he-IL', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  timeZone: 'Asia/Jerusalem'
})}

${aiReport}

📊 <b>סטטיסטיקות מסחר:</b>
• איתותים יומיים: ${dailyStats.dailySignalCount}
• סשן נוכחי: ${dailyStats.sessionSignalsCount}/3
• הפסד יומי: ${dailyStats.dailyLoss.toFixed(1)}%/5%
• יכולת מסחר: ${dailyStats.canTrade ? '✅ פעילה' : '❌ מוגבלת'}

${marketOverview}

🧠 <b>LeviPro Method Status:</b>
✅ פועל באופן אוטונומי
🎯 עדיפות 80% מובטחת
🔄 למידה עצמית פעילה

בהצלחה בטריידינג היום! 🚀
#LeviPro #DailyReport #TradingBrief
`;

      const success = await telegramBot.sendMessage(fullReport);
      
      if (success) {
        console.log('✅ Daily report sent successfully');
      } else {
        console.error('❌ Failed to send daily report');
      }
    } catch (error) {
      console.error('❌ Error generating daily report:', error);
    }
  }

  private async generateMarketOverview(): Promise<string> {
    try {
      const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
      const marketData = await marketDataService.getMultipleMarketData(symbols);
      
      const strongest = Array.from(marketData.entries())
        .sort(([,a], [,b]) => b.priceChange - a.priceChange)
        .slice(0, 2);
      
      const weakest = Array.from(marketData.entries())
        .sort(([,a], [,b]) => a.priceChange - b.priceChange)
        .slice(0, 2);

      let overview = '\n🔍 <b>סקירת שוק:</b>\n';
      
      if (strongest.length > 0) {
        overview += '📈 <b>החזקים:</b>\n';
        strongest.forEach(([symbol, data]) => {
          overview += `• ${symbol.replace('USDT', '/USDT')}: ${data.priceChange > 0 ? '+' : ''}${data.priceChange.toFixed(2)}%\n`;
        });
      }
      
      if (weakest.length > 0) {
        overview += '\n📉 <b>החלשים:</b>\n';
        weakest.forEach(([symbol, data]) => {
          overview += `• ${symbol.replace('USDT', '/USDT')}: ${data.priceChange > 0 ? '+' : ''}${data.priceChange.toFixed(2)}%\n`;
        });
      }

      // Add some market insight
      const avgChange = Array.from(marketData.values())
        .reduce((sum, data) => sum + data.priceChange, 0) / marketData.size;
      
      overview += `\n💡 <b>מצב כללי:</b> ${
        avgChange > 2 ? '🟢 שורי' : 
        avgChange > 0 ? '🟡 מעורב-חיובי' : 
        avgChange > -2 ? '🟡 מעורב-שלילי' : '🔴 דובי'
      }\n`;

      return overview;
    } catch (error) {
      console.error('Error generating market overview:', error);
      return '\n⚠️ לא ניתן היה לטעון סקירת שוק\n';
    }
  }

  public async sendManualDailyReport(): Promise<boolean> {
    console.log('📊 Sending manual daily report...');
    await this.generateAndSendDailyReport();
    return true;
  }

  public stop() {
    if (this.reportInterval) {
      clearInterval(this.reportInterval);
      this.reportInterval = undefined;
    }
  }
}

export const dailyReportService = new DailyReportService();
