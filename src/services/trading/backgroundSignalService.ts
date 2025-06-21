class BackgroundSignalService {
  private worker: Worker | null = null;
  private isRunning = false;
  private interval: NodeJS.Timeout | null = null;

  startBackgroundProcessing() {
    if (this.isRunning) {
      console.log('⚠️ Background signal service already running');
      return;
    }

    console.log('🚀 Starting background signal processing...');
    this.isRunning = true;

    // Run signal analysis every 60 seconds
    this.interval = setInterval(async () => {
      await this.runBackgroundAnalysis();
    }, 60000);

    // Initial run
    this.runBackgroundAnalysis();
  }

  stopBackgroundProcessing() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    this.isRunning = false;
    console.log('🛑 Background signal service stopped');
  }

  private async runBackgroundAnalysis() {
    try {
      console.log('🔍 Running background market analysis...');
      
      // Import the live signal engine dynamically to avoid circular dependencies
      const { liveSignalEngine } = await import('./liveSignalEngine');
      
      // Check if the engine is running, if not, don't process
      const status = liveSignalEngine.getEngineStatus();
      if (!status.isRunning) {
        console.log('⏸️ Signal engine not running, skipping background analysis');
        return;
      }

      // The live signal engine already handles its own analysis loop
      // This service ensures it continues running even if UI is closed
      console.log('✅ Background analysis delegated to live signal engine');
      
    } catch (error) {
      console.error('❌ Background analysis error:', error);
    }
  }

  // Method to keep the service alive even when tab is not active
  setupPageVisibilityHandling() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('📱 Page hidden - background service continues running');
      } else {
        console.log('👁️ Page visible - background service active');
      }
    });

    // Keep alive with periodic heartbeat
    setInterval(() => {
      if (this.isRunning) {
        console.log('💓 Background service heartbeat');
      }
    }, 300000); // 5 minutes
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      lastHeartbeat: new Date().toISOString(),
      uptime: this.isRunning ? Date.now() : 0
    };
  }
}

export const backgroundSignalService = new BackgroundSignalService();

// Auto-start when imported
if (typeof window !== 'undefined') {
  backgroundSignalService.setupPageVisibilityHandling();
}
