import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NLPRequest {
  type: 'headline_analysis' | 'market_context' | 'language_correlation';
  data: {
    headline?: string;
    source?: string;
    headlines?: string[];
    marketData?: any;
    symbol?: string;
    priceMovement?: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { type, data }: NLPRequest = await req.json();

    let prompt = '';
    let systemMessage = 'You are an expert cryptocurrency and financial market analyst with deep knowledge of technical analysis, fundamental analysis, and market psychology.';

    switch (type) {
      case 'headline_analysis':
        systemMessage = 'You are a professional crypto market analyst. Analyze headlines for trading relevance and market impact. Always respond in valid JSON format.';
        prompt = `
Analyze this crypto/financial headline for trading relevance:

"${data.headline}"

Source: ${data.source || 'Unknown'}

Provide JSON analysis:
{
  "marketRelevance": "high|medium|low",
  "sentiment": "bullish|bearish|neutral", 
  "confidenceScore": 0.85,
  "affectedSymbols": ["BTC", "ETH"],
  "timeframe": "immediate|short|medium|long",
  "impact": "high|medium|low",
  "reasoning": ["regulatory impact", "technical development"],
  "keyTriggers": ["approval", "partnership", "regulation"],
  "priceImplication": "positive|negative|neutral"
}

Consider:
- Regulatory announcements (SEC, government policies)
- Technical developments (upgrades, launches)
- Partnership news (institutional adoption)
- Market structure changes
- Whale movements and institutional activity
- Macroeconomic factors affecting crypto
        `;
        break;

      case 'market_context':
        prompt = `
You are a professional crypto market analyst. Generate a concise market context summary based on:

Recent Headlines:
${data.headlines?.slice(0, 5).map((h, i) => `${i + 1}. ${h}`).join('\n')}

Market Data:
- Overall sentiment: ${data.marketData?.sentiment || 'neutral'}
- Fear & Greed: ${data.marketData?.fearGreed || 50}
- Volume trend: ${data.marketData?.volumeTrend || 'stable'}
- Volatility: ${data.marketData?.volatility || 'normal'}

Provide a professional 2-3 sentence summary in Hebrew focusing on:
1. Key market drivers affecting price action
2. Primary risk factors traders should monitor
3. Immediate opportunity areas or cautions

Keep it actionable for professional traders. Use Hebrew language for the summary.
        `;
        break;

      case 'language_correlation':
        prompt = `
Analyze the correlation between this headline and the observed price movement:

Headline: "${data.headline}"
Symbol: ${data.symbol}
Price Movement: ${data.priceMovement! > 0 ? '+' : ''}${data.priceMovement?.toFixed(2)}%

Identify:
1. Key language patterns that correlated with this price movement
2. Correlation strength (0-1)
3. Specific words/phrases that were predictive
4. Historical pattern recognition

Return JSON:
{
  "correlation": 0.75,
  "patterns": ["regulatory approval", "partnership announcement"],
  "keyWords": ["approved", "partners with", "breakthrough"],
  "sentiment": "bullish|bearish|neutral",
  "predictiveStrength": "high|medium|low",
  "futureImplications": "description of what this suggests for future similar headlines"
}
        `;
        break;

      default:
        throw new Error('Invalid analysis type');
    }

    console.log(`Processing ${type} request with OpenAI`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const openAIData = await response.json();
    const content = openAIData.choices[0].message.content;

    console.log('OpenAI response received');

    // Try to parse as JSON for structured responses
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      // If not JSON, return as text (for market context)
      result = { text: content, type };
    }

    return new Response(JSON.stringify({ 
      success: true, 
      result,
      type,
      timestamp: Date.now()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in openai-nlp-processor function:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      timestamp: Date.now()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});