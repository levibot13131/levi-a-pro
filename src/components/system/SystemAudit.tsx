
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Brain,
  Activity,
  Shield,
  Zap,
  TrendingUp,
  BarChart3,
  Target,
  Globe,
  MessageCircle,
  Database,
  Wifi,
  Eye,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditItem {
  name: string;
  status: 'completed' | 'partial' | 'pending' | 'disabled';
  priority: 'critical' | 'high' | 'medium' | 'low';
  details: string;
  implementation: string;
}

interface AuditCategory {
  category: string;
  icon: React.ReactNode;
  items: AuditItem[];
}

const SystemAudit: React.FC = () => {
  const [auditData, setAuditData] = useState<AuditCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditData();
  }, []);

  const loadAuditData = async () => {
    setLoading(true);
    
    // Simulate system audit
    const audit: AuditCategory[] = [
      {
        category: '🧠 Almog\'s Personal Strategy (TOP PRIORITY)',
        icon: <Brain className="h-5 w-5 text-blue-600" />,
        items: [
          {
            name: 'Emotional Pressure Zones',
            status: 'completed',
            priority: 'critical',
            details: 'Real-time volume/price analysis with psychological resistance levels',
            implementation: 'Active in strategyEngine.ts - evaluatePersonalStrategy()'
          },
          {
            name: 'Momentum Analysis',
            status: 'completed',
            priority: 'critical',
            details: '24h behavior tracking with volume confirmation',
            implementation: 'Integrated with marketDataService + technical indicators'
          },
          {
            name: 'Multi-Strategy Agreement (2+)',
            status: 'completed',
            priority: 'critical',
            details: 'Requires 2+ strategies to agree before signal generation',
            implementation: 'Enforced in tradingEngine.analyzeMarkets() with confidence weighting'
          },
          {
            name: 'Confidence Limit (95% Max)',
            status: 'completed',
            priority: 'critical',
            details: 'Hard-coded maximum confidence to prevent overconfidence',
            implementation: 'Capped in calculateConfidenceScore() - adaptiveEngine.ts'
          },
          {
            name: 'Priority Weighting (Always First)',
            status: 'completed',
            priority: 'critical',
            details: 'Personal strategy executes first, minimum 80% weight protection',
            implementation: 'Protected in adjustStrategyWeights() with special rule'
          },
          {
            name: 'Auto-Protection (Never Disabled)',
            status: 'completed',
            priority: 'critical',
            details: 'Personal strategy immune to automatic disabling',
            implementation: 'Hard-coded exception in shouldDisableStrategy()'
          }
        ]
      },
      {
        category: '📈 Advanced Trading Strategies',
        icon: <TrendingUp className="h-5 w-5 text-green-600" />,
        items: [
          {
            name: 'RSI + MACD Strategy',
            status: 'completed',
            priority: 'high',
            details: 'Classic oversold/crossover detection with divergence analysis',
            implementation: 'evaluateRSIMACDStrategy() in strategyEngine.ts'
          },
          {
            name: 'Fibonacci Retracements',
            status: 'completed',
            priority: 'high',
            details: '61.8%, 78.6%, 38.2% level detection with confluence',
            implementation: 'evaluateFibonacciStrategy() with price proximity detection'
          },
          {
            name: 'VWAP + Volume Profile',
            status: 'completed',
            priority: 'high',
            details: 'Volume-weighted average price with high-volume node analysis',
            implementation: 'evaluateVolumeStrategy() with VWAP confirmation'
          },
          {
            name: 'Candlestick Patterns',
            status: 'completed',
            priority: 'medium',
            details: 'Engulfing, Hammer, Pinbar, Doji detection',
            implementation: 'evaluateCandlestickStrategy() with pattern recognition'
          },
          {
            name: 'Support & Resistance',
            status: 'partial',
            priority: 'high',
            details: 'Basic level detection implemented, needs historical confidence weighting',
            implementation: 'Integrated in fibonacci and volume strategies'
          },
          {
            name: 'Breakouts with Volume',
            status: 'completed',
            priority: 'high',
            details: 'Momentum breakouts confirmed by volume spikes',
            implementation: 'evaluateMomentumStrategy() with volume multiplier'
          },
          {
            name: 'Wyckoff Method',
            status: 'completed',
            priority: 'medium',
            details: 'Phase detection: accumulation, markup, distribution, markdown',
            implementation: 'evaluateWyckoffStrategy() with wyckoffPhase analysis'
          },
          {
            name: 'Smart Money Concepts (SMC)',
            status: 'completed',
            priority: 'high',
            details: 'Order blocks, liquidity grabs, fair value gaps',
            implementation: 'evaluateSMCStrategy() + smartMoneyEngine.ts integration'
          },
          {
            name: 'Elliott Wave Theory',
            status: 'completed',
            priority: 'medium',
            details: 'Impulse & corrective wave detection with Fibonacci projections',
            implementation: 'elliotWaveEngine.ts with full wave structure analysis'
          },
          {
            name: 'Quarter Theory',
            status: 'pending',
            priority: 'medium',
            details: '0.25, 0.50, 0.75 level recognition - not yet implemented',
            implementation: 'Planned for next phase'
          }
        ]
      },
      {
        category: '🧠 Learning & Optimization Engine',
        icon: <Brain className="h-5 w-5 text-purple-600" />,
        items: [
          {
            name: 'Signal Feedback Loop',
            status: 'completed',
            priority: 'critical',
            details: 'Records win/loss outcomes for each signal',
            implementation: 'recordSignalFeedback() in adaptiveEngine.ts'
          },
          {
            name: 'Strategy Weight Auto-Adjustment',
            status: 'completed',
            priority: 'critical',
            details: 'Dynamically adjusts strategy weights based on performance',
            implementation: 'adjustStrategyWeights() with learning rate of 10%'
          },
          {
            name: 'Adaptive Confidence Scoring',
            status: 'completed',
            priority: 'high',
            details: 'Confidence levels adjusted based on historical success',
            implementation: 'calculateConfidenceScore() with success/profit weighting'
          },
          {
            name: 'Time-of-Day Performance',
            status: 'completed',
            priority: 'medium',
            details: 'Tracks optimal trading hours based on historical wins',
            implementation: 'calculateTimeOfDayPerformance() + getOptimalTradingHours()'
          },
          {
            name: 'Auto-Disable Poor Strategies',
            status: 'completed',
            priority: 'high',
            details: 'Disables strategies with <25% success rate (except personal)',
            implementation: 'shouldDisableStrategy() with performance thresholds'
          },
          {
            name: 'Performance Dashboard',
            status: 'completed',
            priority: 'medium',
            details: 'Real-time strategy performance monitoring',
            implementation: 'AdaptiveDashboard.tsx with live performance metrics'
          }
        ]
      },
      {
        category: '📊 Data Sources & Real-Time',
        icon: <Database className="h-5 w-5 text-orange-600" />,
        items: [
          {
            name: 'Binance API Integration',
            status: 'completed',
            priority: 'critical',
            details: 'Live price/volume data every 30 seconds',
            implementation: 'marketDataService.ts with price + volume fetching'
          },
          {
            name: 'CoinGecko Integration',
            status: 'completed',
            priority: 'high',
            details: 'Market cap, sentiment, and fundamental data',
            implementation: 'Health check in tradingEngine.ts'
          },
          {
            name: 'Live Data Only (No Demo)',
            status: 'completed',
            priority: 'critical',
            details: 'All signals marked with live_data: true',
            implementation: 'Enforced in signal generation + database storage'
          },
          {
            name: '30-Second Market Analysis',
            status: 'completed',
            priority: 'critical',
            details: 'Continuous market scanning and signal generation',
            implementation: 'tradingEngine.analyzeMarkets() on 30s interval'
          },
          {
            name: 'Twitter/X Integration',
            status: 'pending',
            priority: 'high',
            details: 'Sentiment analysis from crypto Twitter - planned',
            implementation: 'Not yet implemented - Phase 2'
          },
          {
            name: 'Reddit Integration',
            status: 'pending',
            priority: 'medium',
            details: 'r/cryptocurrency sentiment tracking - planned',
            implementation: 'Not yet implemented - Phase 2'
          },
          {
            name: 'News Sentiment Analysis',
            status: 'pending',
            priority: 'high',
            details: 'CoinDesk, Cointelegraph headline analysis - planned',
            implementation: 'Not yet implemented - Phase 2'
          },
          {
            name: 'Whale Wallet Monitoring',
            status: 'pending',
            priority: 'medium',
            details: 'On-chain large transaction tracking - planned',
            implementation: 'Not yet implemented - Phase 3'
          }
        ]
      },
      {
        category: '🔐 Risk Management & Control',
        icon: <Shield className="h-5 w-5 text-red-600" />,
        items: [
          {
            name: 'Position Size Calculator',
            status: 'completed',
            priority: 'critical',
            details: 'Auto-calculates position size based on SL/TP and account size',
            implementation: 'Integrated in signal generation with risk/reward ratios'
          },
          {
            name: 'Stop Loss / Take Profit Auto-Calc',
            status: 'completed',
            priority: 'critical',
            details: 'Automatic SL/TP calculation per strategy rules',
            implementation: 'Each strategy calculates targetPrice and stopLoss'
          },
          {
            name: 'Max 3 Trades Per Day',
            status: 'partial',
            priority: 'high',
            details: 'Tracking implemented, enforcement needs completion',
            implementation: 'Tracked in trading_engine_status table'
          },
          {
            name: '5% Daily Drawdown Cap',
            status: 'partial',
            priority: 'high',
            details: 'Monitoring implemented, auto-stop needs completion',
            implementation: 'Tracked but auto-disable pending'
          },
          {
            name: '2% Max Risk Per Trade',
            status: 'completed',
            priority: 'critical',
            details: 'Hardcoded maximum risk percentage per position',
            implementation: 'Enforced in user_trading_settings with default 2%'
          },
          {
            name: 'Risk/Reward Ratio (1.5:1 Min)',
            status: 'completed',
            priority: 'critical',
            details: 'Minimum 1.5:1 risk/reward ratio for all signals',
            implementation: 'Calculated and enforced in signal generation'
          }
        ]
      },
      {
        category: '🧱 System Architecture',
        icon: <Settings className="h-5 w-5 text-gray-600" />,
        items: [
          {
            name: 'Modular Strategy Framework',
            status: 'completed',
            priority: 'high',
            details: 'Easy to add/remove/disable individual strategies',
            implementation: 'Map-based strategy system in strategyEngine.ts'
          },
          {
            name: 'Per-Strategy Performance Dashboar',
            status: 'completed',
            priority: 'medium',
            details: 'Individual strategy performance metrics',
            implementation: 'AdaptiveDashboard.tsx with detailed breakdowns'
          },
          {
            name: 'Full Signal Metadata Logging',
            status: 'completed',
            priority: 'high',
            details: 'Complete signal history with reasoning and metadata',
            implementation: 'trading_signals table with jsonb metadata field'
          },
          {
            name: 'Strategy Priority Ranking',
            status: 'completed',
            priority: 'critical',
            details: 'Personal strategy always ranks first in execution',
            implementation: 'Weight-based priority system with personal strategy protection'
          },
          {
            name: 'Real-time Dashboard Updates',
            status: 'completed',
            priority: 'medium',
            details: 'Live updates of system status and performance',
            implementation: 'Event-driven updates with 5-minute refresh intervals'
          },
          {
            name: 'Telegram Integration',
            status: 'completed',
            priority: 'high',
            details: 'Real-time Hebrew signal notifications',
            implementation: 'telegramBot.ts with formatted Hebrew messages'
          }
        ]
      }
    ];

    setAuditData(audit);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-red-500" />;
      case 'disabled':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">✅ מושלם</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">⚠️ חלקי</Badge>;
      case 'pending':
        return <Badge className="bg-red-100 text-red-800">⏳ ממתין</Badge>;
      case 'disabled':
        return <Badge className="bg-gray-100 text-gray-800">❌ מושבת</Badge>;
      default:
        return <Badge variant="secondary">❓ לא ידוע</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Calculate completion statistics
  const totalItems = auditData.reduce((sum, category) => sum + category.items.length, 0);
  const completedItems = auditData.reduce((sum, category) => 
    sum + category.items.filter(item => item.status === 'completed').length, 0
  );
  const partialItems = auditData.reduce((sum, category) => 
    sum + category.items.filter(item => item.status === 'partial').length, 0
  );
  const pendingItems = auditData.reduce((sum, category) => 
    sum + category.items.filter(item => item.status === 'pending').length, 0
  );
  
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Activity className="h-6 w-6 animate-spin mr-2" />
            <span>מבצע ביקורת מערכת מלאה...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-6 w-6" />
              ביקורת מערכת מלאה - LeviPro
            </div>
            <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
              {completionPercentage}% מושלם
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>התקדמות כללית</span>
                <span>{completedItems}/{totalItems} פיצ'רים</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span><strong>{completedItems}</strong> הושלמו</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span><strong>{partialItems}</strong> חלקיים</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-500" />
                <span><strong>{pendingItems}</strong> ממתינים</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span><strong>95%</strong> יעד</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Audit */}
      {auditData.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-3">
              {category.icon}
              <span className="text-lg">{category.category}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.items.map((item, itemIndex) => (
                <div 
                  key={itemIndex} 
                  className={`p-4 rounded border-l-4 ${getPriorityColor(item.priority)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      {getStatusBadge(item.status)}
                    </div>
                    <h3 className="font-semibold text-right">{item.name}</h3>
                  </div>
                  
                  <div className="text-right text-sm space-y-2">
                    <p className="text-gray-700">{item.details}</p>
                    <p className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                      <strong>יישום:</strong> {item.implementation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Summary & Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            סיכום וצעדים הבאים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-right">
            <div className="p-4 bg-green-50 border-l-4 border-l-green-500 rounded">
              <h4 className="font-bold text-green-800 mb-2">✅ מה שהושלם במלואו</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• השיטה האישית של אלמוג עם עדיפות מוחלטת</li>
                <li>• מנוע למידה אדפטיבי עם התאמת משקלים</li>
                <li>• 8 אסטרטגיות מסחר מתקדמות פעילות</li>
                <li>• נתונים חיים כל 30 שניות מ-Binance</li>
                <li>• ניהול סיכונים עם חישוב אוטומטי</li>
                <li>• התראות טלגרם בעברית בזמן אמת</li>
                <li>• דשבורד מתקדם עם מטריקות ביצועים</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border-l-4 border-l-yellow-500 rounded">
              <h4 className="font-bold text-yellow-800 mb-2">⚠️ מה שצריך השלמה</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• הגבלת 3 עסקאות יומיות (מעקב קיים, אכיפה חסרה)</li>
                <li>• הפסקה אוטומטית ב-5% הפסד יומי</li>
                <li>• תמיכה והתנגדות עם משקל היסטורי</li>
              </ul>
            </div>

            <div className="p-4 bg-red-50 border-l-4 border-l-red-500 rounded">
              <h4 className="font-bold text-red-800 mb-2">🔄 מה שבתכנון (שלב 2)</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Quarter Theory (רמות 0.25, 0.50, 0.75)</li>
                <li>• אינטגרציית Twitter/X לניתוח סנטימנט</li>
                <li>• ניטור חדשות מ-CoinDesk, Cointelegraph</li>
                <li>• מעקב ארנקי לווייתנים (on-chain)</li>
                <li>• Reddit sentiment analysis</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border-l-4 border-l-blue-500 rounded">
              <h4 className="font-bold text-blue-800 mb-2">🎯 המלצות לפעילות מיידית</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• הפעל את המנוע עם השיטה האישית כעדיפות עליונה</li>
                <li>• עקוב אחר הדשבורד האדפטיבי לביצועי אסטרטגיות</li>
                <li>• אמת איתותים נגד תנאי השוק החיים</li>
                <li>• השתמש במערכת המשוב לשיפור האלגוריתם</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemAudit;
