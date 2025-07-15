-- Fix market intelligence content types to match enum constraints
-- This will resolve constraint violations when inserting market intelligence data

-- First, check and clean any invalid content_type values
UPDATE public.market_intelligence 
SET content_type = 'news' 
WHERE content_type NOT IN ('news', 'social', 'analysis', 'alert');

-- Add a check constraint to ensure only valid content types are allowed
ALTER TABLE public.market_intelligence 
ADD CONSTRAINT market_intelligence_content_type_check 
CHECK (content_type IN ('news', 'social', 'analysis', 'alert'));

-- Update any existing records with proper content types
UPDATE public.market_intelligence 
SET content_type = CASE 
  WHEN source LIKE '%twitter%' OR source LIKE '%telegram%' THEN 'social'
  WHEN source LIKE '%news%' OR source LIKE '%reuters%' OR source LIKE '%bloomberg%' THEN 'news'
  WHEN source LIKE '%analysis%' OR source LIKE '%report%' THEN 'analysis'
  WHEN source LIKE '%alert%' OR source LIKE '%whale%' THEN 'alert'
  ELSE 'news'
END
WHERE content_type IS NULL OR content_type = '';

-- Ensure the table has proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_market_intelligence_content_type ON public.market_intelligence(content_type);
CREATE INDEX IF NOT EXISTS idx_market_intelligence_published_at ON public.market_intelligence(published_at);
CREATE INDEX IF NOT EXISTS idx_market_intelligence_symbols ON public.market_intelligence USING GIN(symbols);