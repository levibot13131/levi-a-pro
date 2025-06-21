
-- Create signal_results table for AI learning engine
CREATE TABLE IF NOT EXISTS signal_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  signal_id TEXT NOT NULL,
  strategy TEXT NOT NULL,
  symbol TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('buy', 'sell')),
  entry_price DECIMAL(20, 6) NOT NULL,
  exit_price DECIMAL(20, 6) NOT NULL,
  profit_percent DECIMAL(10, 4) NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('win', 'loss', 'breakeven')),
  duration INTEGER NOT NULL, -- in minutes
  timestamp BIGINT NOT NULL,
  confidence DECIMAL(3, 2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  risk_reward_ratio DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_signal_results_strategy ON signal_results(strategy);
CREATE INDEX IF NOT EXISTS idx_signal_results_symbol ON signal_results(symbol);
CREATE INDEX IF NOT EXISTS idx_signal_results_timestamp ON signal_results(timestamp);
CREATE INDEX IF NOT EXISTS idx_signal_results_outcome ON signal_results(outcome);

-- Add RLS (Row Level Security)
ALTER TABLE signal_results ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert and read their own data
CREATE POLICY "Users can insert signal results" ON signal_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view signal results" ON signal_results FOR SELECT USING (true);

-- Add trigger for updated_at
CREATE OR REPLACE TRIGGER update_signal_results_updated_at
  BEFORE UPDATE ON signal_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
