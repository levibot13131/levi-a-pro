
// Re-export everything from the marketInformation directory
export * from './marketInformation/index';

// Re-export specific types to fix import errors
export type { 
  FinancialDataSource,
  MarketInfluencer,
  MarketEvent 
} from './marketInformation';

// Re-export from old file structure for backward compatibility
export * from './marketInformation';
