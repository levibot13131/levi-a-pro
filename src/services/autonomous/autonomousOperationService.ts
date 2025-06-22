
export interface SystemHealth {
  isOperational: boolean;
  uptime: number;
  components: {
    marketData: boolean;
    newsService: boolean;
    signalEngine: boolean;
    riskManager: boolean;
    telegramBot: boolean;
  };
  performanceMetrics: {
    signalsGenerated: number;
    successRate: number;
    avgResponseTime: number;
  };
  lastHealthCheck: number;
}

class AutonomousOperationService {
  private isRunning = false;
  private startTime = 0;
  private signalsGenerated = 0;
  private successfulSignals = 0;

  startAutonomousOperation(): void {
    if (this.isRunning) return;
    
    console.log('🤖 Starting Autonomous Operation Service...');
    this.isRunning = true;
    this.startTime = Date.now();
    
    console.log('✅ Autonomous Operation Service started');
  }

  stopAutonomousOperation(): void {
    if (!this.isRunning) return;
    
    console.log('🤖 Stopping Autonomous Operation Service...');
    this.isRunning = false;
    
    console.log('✅ Autonomous Operation Service stopped');
  }

  isSystemOperational(): boolean {
    return this.isRunning;
  }

  getSystemHealth(): SystemHealth {
    const uptime = this.isRunning ? Date.now() - this.startTime : 0;
    
    return {
      isOperational: this.isRunning,
      uptime,
      components: {
        marketData: true,
        newsService: true,
        signalEngine: this.isRunning,
        riskManager: true,
        telegramBot: true
      },
      performanceMetrics: {
        signalsGenerated: this.signalsGenerated,
        successRate: this.signalsGenerated > 0 ? this.successfulSignals / this.signalsGenerated : 0,
        avgResponseTime: 150
      },
      lastHealthCheck: Date.now()
    };
  }

  recordSignal(successful: boolean = true): void {
    this.signalsGenerated++;
    if (successful) {
      this.successfulSignals++;
    }
  }
}

export const autonomousOperationService = new AutonomousOperationService();
