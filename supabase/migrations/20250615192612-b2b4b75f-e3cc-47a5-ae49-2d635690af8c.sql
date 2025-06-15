
-- Create trading strategies table
CREATE TABLE public.trading_strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('personal', 'wyckoff', 'smc', 'fibonacci', 'momentum', 'candlestick', 'volume', 'rsi_macd', 'patterns')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  weight DECIMAL(3,2) NOT NULL DEFAULT 1.0 CHECK (weight >= 0 AND weight <= 1),
  parameters JSONB NOT NULL DEFAULT '{}',
  success_rate DECIMAL(5,4) NOT NULL DEFAULT 0,
  total_signals INTEGER NOT NULL DEFAULT 0,
  profitable_signals INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trading signals table
CREATE TABLE public.trading_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  signal_id TEXT NOT NULL UNIQUE,
  symbol TEXT NOT NULL,
  strategy TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('buy', 'sell')),
  price DECIMAL(20,8) NOT NULL,
  target_price DECIMAL(20,8) NOT NULL,
  stop_loss DECIMAL(20,8) NOT NULL,
  confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  risk_reward_ratio DECIMAL(5,2) NOT NULL,
  reasoning TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'executed', 'stopped', 'expired')),
  executed_price DECIMAL(20,8),
  exit_price DECIMAL(20,8),
  profit DECIMAL(20,8),
  profit_percent DECIMAL(5,2),
  exit_reason TEXT CHECK (exit_reason IN ('target', 'stop', 'manual', 'timeout')),
  executed_at TIMESTAMP WITH TIME ZONE,
  telegram_sent BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user settings table for trading configuration
CREATE TABLE public.user_trading_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  telegram_bot_token TEXT,
  telegram_chat_id TEXT DEFAULT '809305569',
  binance_api_key TEXT,
  binance_secret_key TEXT,
  tradingview_username TEXT,
  max_risk_per_trade DECIMAL(3,2) NOT NULL DEFAULT 0.02 CHECK (max_risk_per_trade > 0 AND max_risk_per_trade <= 1),
  auto_trading_enabled BOOLEAN NOT NULL DEFAULT false,
  strategies_enabled TEXT[] DEFAULT ARRAY['personal-strategy'],
  notification_settings JSONB NOT NULL DEFAULT '{"telegram": true, "email": false, "pushNotifications": false}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create market data cache table
CREATE TABLE public.market_data_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  price DECIMAL(20,8) NOT NULL,
  volume DECIMAL(20,8) NOT NULL,
  rsi DECIMAL(5,2),
  macd_data JSONB,
  volume_profile DECIMAL(10,4),
  vwap DECIMAL(20,8),
  fibonacci_data JSONB,
  candlestick_pattern TEXT,
  wyckoff_phase TEXT CHECK (wyckoff_phase IN ('accumulation', 'distribution', 'markup', 'markdown')),
  smc_signals JSONB,
  sentiment_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(symbol, created_at)
);

-- Create system health log table
CREATE TABLE public.system_health_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  binance_status BOOLEAN NOT NULL DEFAULT false,
  tradingview_status BOOLEAN NOT NULL DEFAULT false,
  twitter_status BOOLEAN NOT NULL DEFAULT false,
  coingecko_status BOOLEAN NOT NULL DEFAULT false,
  telegram_status BOOLEAN NOT NULL DEFAULT false,
  fundamental_data_status BOOLEAN NOT NULL DEFAULT false,
  overall_health_score DECIMAL(3,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trading engine status table
CREATE TABLE public.trading_engine_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  is_running BOOLEAN NOT NULL DEFAULT false,
  watch_list TEXT[] DEFAULT ARRAY['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'],
  last_analysis_at TIMESTAMP WITH TIME ZONE,
  total_signals_generated INTEGER NOT NULL DEFAULT 0,
  profitable_signals INTEGER NOT NULL DEFAULT 0,
  success_rate DECIMAL(5,4) NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  stopped_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.trading_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trading_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_data_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_engine_status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for trading_strategies
CREATE POLICY "Users can view their own trading strategies" 
  ON public.trading_strategies 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trading strategies" 
  ON public.trading_strategies 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trading strategies" 
  ON public.trading_strategies 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trading strategies" 
  ON public.trading_strategies 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for trading_signals
CREATE POLICY "Users can view their own trading signals" 
  ON public.trading_signals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trading signals" 
  ON public.trading_signals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trading signals" 
  ON public.trading_signals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for user_trading_settings
CREATE POLICY "Users can view their own trading settings" 
  ON public.user_trading_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trading settings" 
  ON public.user_trading_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trading settings" 
  ON public.user_trading_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for market_data_cache (read-only for authenticated users)
CREATE POLICY "Authenticated users can read market data" 
  ON public.market_data_cache 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create RLS policies for system_health_log
CREATE POLICY "Users can view their own system health logs" 
  ON public.system_health_log 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own system health logs" 
  ON public.system_health_log 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for trading_engine_status
CREATE POLICY "Users can view their own trading engine status" 
  ON public.trading_engine_status 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trading engine status" 
  ON public.trading_engine_status 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trading engine status" 
  ON public.trading_engine_status 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_trading_signals_user_id ON public.trading_signals(user_id);
CREATE INDEX idx_trading_signals_symbol ON public.trading_signals(symbol);
CREATE INDEX idx_trading_signals_status ON public.trading_signals(status);
CREATE INDEX idx_trading_signals_created_at ON public.trading_signals(created_at);
CREATE INDEX idx_trading_strategies_user_id ON public.trading_strategies(user_id);
CREATE INDEX idx_trading_strategies_type ON public.trading_strategies(type);
CREATE INDEX idx_market_data_symbol ON public.market_data_cache(symbol);
CREATE INDEX idx_market_data_created_at ON public.market_data_cache(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_trading_strategies_updated_at 
  BEFORE UPDATE ON public.trading_strategies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trading_signals_updated_at 
  BEFORE UPDATE ON public.trading_signals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_trading_settings_updated_at 
  BEFORE UPDATE ON public.user_trading_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trading_engine_status_updated_at 
  BEFORE UPDATE ON public.trading_engine_status 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
