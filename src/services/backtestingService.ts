// Import from the backtesting directory
import { BacktestResult } from './backtesting/types';
import { calculatePositionSize, PositionSizingInput } from './backtesting/positionSizer';

// Re-export with a different name to avoid conflict
export { BacktestResult as BacktestingResult };
export { calculatePositionSize };
export type { PositionSizingInput };
