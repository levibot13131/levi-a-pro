
-- Function to record signal feedback
CREATE OR REPLACE FUNCTION record_signal_feedback(
  p_user_id UUID,
  p_signal_id TEXT,
  p_strategy_used TEXT,
  p_outcome TEXT,
  p_profit_loss_percentage DECIMAL,
  p_execution_time TIMESTAMP WITH TIME ZONE,
  p_market_conditions TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO signal_feedback (
    user_id, signal_id, strategy_used, outcome, 
    profit_loss_percentage, execution_time, market_conditions
  ) VALUES (
    p_user_id, p_signal_id, p_strategy_used, p_outcome,
    p_profit_loss_percentage, p_execution_time, p_market_conditions
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get strategy performance data
CREATE OR REPLACE FUNCTION get_strategy_performance(
  p_user_id UUID,
  p_strategy_name TEXT
) RETURNS TABLE (
  outcome TEXT,
  profit_loss_percentage DECIMAL,
  execution_time TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT sf.outcome, sf.profit_loss_percentage, sf.execution_time
  FROM signal_feedback sf
  WHERE sf.user_id = p_user_id 
    AND sf.strategy_used = p_strategy_name
  ORDER BY sf.created_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update strategy performance
CREATE OR REPLACE FUNCTION update_strategy_performance(
  p_user_id UUID,
  p_strategy_id TEXT,
  p_strategy_name TEXT,
  p_total_signals INTEGER,
  p_successful_signals INTEGER,
  p_failed_signals INTEGER,
  p_success_rate DECIMAL,
  p_avg_profit_loss DECIMAL,
  p_current_weight DECIMAL,
  p_confidence_score DECIMAL,
  p_time_of_day_performance JSONB
) RETURNS VOID AS $$
BEGIN
  INSERT INTO strategy_performance (
    user_id, strategy_id, strategy_name, total_signals, successful_signals,
    failed_signals, success_rate, avg_profit_loss, current_weight,
    confidence_score, time_of_day_performance, last_updated
  ) VALUES (
    p_user_id, p_strategy_id, p_strategy_name, p_total_signals, p_successful_signals,
    p_failed_signals, p_success_rate, p_avg_profit_loss, p_current_weight,
    p_confidence_score, p_time_of_day_performance, now()
  )
  ON CONFLICT (user_id, strategy_id) DO UPDATE SET
    strategy_name = p_strategy_name,
    total_signals = p_total_signals,
    successful_signals = p_successful_signals,
    failed_signals = p_failed_signals,
    success_rate = p_success_rate,
    avg_profit_loss = p_avg_profit_loss,
    current_weight = p_current_weight,
    confidence_score = p_confidence_score,
    time_of_day_performance = p_time_of_day_performance,
    last_updated = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all strategy performance
CREATE OR REPLACE FUNCTION get_all_strategy_performance(
  p_user_id UUID
) RETURNS TABLE (
  strategy_id TEXT,
  strategy_name TEXT,
  total_signals INTEGER,
  successful_signals INTEGER,
  failed_signals INTEGER,
  success_rate DECIMAL,
  avg_profit_loss DECIMAL,
  current_weight DECIMAL,
  confidence_score DECIMAL,
  time_of_day_performance JSONB,
  last_updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT sp.strategy_id, sp.strategy_name, sp.total_signals, sp.successful_signals,
         sp.failed_signals, sp.success_rate, sp.avg_profit_loss, sp.current_weight,
         sp.confidence_score, sp.time_of_day_performance, sp.last_updated
  FROM strategy_performance sp
  WHERE sp.user_id = p_user_id
  ORDER BY sp.success_rate DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current strategy weight
CREATE OR REPLACE FUNCTION get_current_strategy_weight(
  p_strategy_id TEXT
) RETURNS TABLE (current_weight DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT sp.current_weight
  FROM strategy_performance sp
  WHERE sp.strategy_id = p_strategy_id
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get strategy performance by name
CREATE OR REPLACE FUNCTION get_strategy_performance_by_name(
  p_user_id UUID,
  p_strategy_name TEXT
) RETURNS TABLE (
  success_rate DECIMAL,
  avg_profit_loss DECIMAL,
  total_signals INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT sp.success_rate, sp.avg_profit_loss, sp.total_signals
  FROM strategy_performance sp
  WHERE sp.user_id = p_user_id AND sp.strategy_name = p_strategy_name
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get winning signals by hour
CREATE OR REPLACE FUNCTION get_winning_signals_by_hour(
  p_user_id UUID
) RETURNS TABLE (execution_time TIMESTAMP WITH TIME ZONE) AS $$
BEGIN
  RETURN QUERY
  SELECT sf.execution_time
  FROM signal_feedback sf
  WHERE sf.user_id = p_user_id AND sf.outcome = 'win';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
