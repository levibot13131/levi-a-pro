
// This file is maintained for backward compatibility.
// New code should import directly from the specific service files or from the index.

import { toast } from 'sonner';
import { getTradingViewCredentials } from './tradingViewAuthService';

// Re-export everything from the modular services
export * from './types';
export * from './chartDataService';
export * from './newsService';
export * from './syncService';
