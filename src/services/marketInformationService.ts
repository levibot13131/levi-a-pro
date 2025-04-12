
// Re-export everything from the marketInformation directory
export * from './marketInformation/index';

// Re-export specific types to fix import errors
export type { 
  FinancialDataSource,
  MarketInfluencer,
  MarketEvent,
  MarketSource
} from '@/types/marketInformation';

// Old types are kept for backward compatibility but not re-exported to avoid conflicts
