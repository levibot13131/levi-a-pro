# Real-Time Trading & Analytics Platform

## Project Overview

This platform provides real-time trading analytics and visualization for financial assets, with a focus on cryptocurrency markets. It integrates with several data sources including TradingView to offer comprehensive market insights.

## Key Features

- Real-time asset price tracking
- Interactive charts with multiple visualization options
- Technical indicators and pattern recognition
- Trading signals and alerts
- Customizable watchlists and asset tracking

## Architecture Documentation

For a comprehensive understanding of our system's architecture, we provide detailed visual guides:

- [Overall Architecture Diagram](./docs/architecture-diagram.svg)
- [TradingView Integration Flow](./docs/tradingview-integration-flow.svg)
- [Real-Time Sync Architecture](./docs/realtime-sync-flow.svg)

### Diagram Legend

Refer to our [diagrams.md](./docs/diagrams.md) for a detailed explanation of:
- Color coding
- Visual elements
- How to interpret the architecture diagrams

## TradingView Integration

### Overview

The platform integrates with TradingView to provide professional-grade charting capabilities and real-time market data. This integration encompasses several components:

1. **Authentication & Connection Management** - Secure connection to TradingView accounts
2. **Real-Time Data Synchronization** - Configurable auto-sync for market data
3. **Interactive Charts** - Multiple chart types with customization options
4. **Technical Analysis** - Indicators, patterns, and signal detection

### Core Components

#### Chart Components

The chart visualization system consists of the following components:

- `TradingViewChart` - Main chart container with controls
- `ChartRenderer` - Core renderer that selects appropriate chart type
- Chart Types:
  - `CustomAreaChart` - For area charts
  - `CustomLineChart` - For line charts
  - `CustomBarChart` - For bar charts

#### Integration Hooks

```typescript
// Main integration hook
const {
  isConnected,         // Whether connected to TradingView
  credentials,         // Current credentials (if connected)
  connect,             // Function to connect to TradingView
  disconnect,          // Function to disconnect
  syncEnabled,         // Whether auto-sync is enabled
  isSyncing,           // Whether currently syncing
  manualSync,          // Function to trigger manual sync
  toggleAutoSync,      // Function to toggle auto-sync
  fetchChartData       // Function to fetch chart data
} = useTradingViewIntegration();

// Chart data hook
const {
  chartData,           // Current chart data
  isLoading,           // Whether data is loading
  error,               // Any error that occurred
  loadChartData,       // Function to reload chart data
  percentChange,       // Calculated percent change
  isPositiveChange     // Whether change is positive
} = useChartData('BTCUSD', '1D');
```

### Usage Guidelines

#### Connecting to TradingView

To establish a TradingView connection:

```typescript
import { useTradingViewIntegration } from '@/hooks/use-tradingview-integration';

function MyComponent() {
  const { isConnected, connect, disconnect } = useTradingViewIntegration();
  
  const handleConnect = async () => {
    // Connect with username, optional password and API key
    await connect('username', 'password', 'api_key');
  };
  
  return (
    <div>
      {isConnected ? (
        <button onClick={disconnect}>Disconnect</button>
      ) : (
        <button onClick={handleConnect}>Connect to TradingView</button>
      )}
    </div>
  );
}
```

#### Displaying Charts

To display a TradingView chart:

```typescript
import TradingViewChart from '@/components/tradingview/TradingViewChart';

function AssetView() {
  return (
    <TradingViewChart 
      symbol="BTCUSD"
      timeframe="1D"
      showToolbar={true}
      height={400}
    />
  );
}
```

#### Chart Customization Options

The chart components support the following customization props:

- `symbol` (required) - Trading symbol (e.g., 'BTCUSD')
- `timeframe` - Chart timeframe (default: '1D')
- `showToolbar` - Whether to display the chart toolbar (default: true)
- `height` - Chart height in pixels (default: 400)
- `onSymbolChange` - Callback function when symbol changes

#### Managing Real-Time Sync

To control real-time data synchronization:

```typescript
import { useTradingViewSync } from '@/hooks/use-tradingview-sync';

function SyncControls() {
  // Initialize with connection status
  const { 
    syncEnabled, 
    toggleAutoSync, 
    manualSync, 
    isSyncing 
  } = useTradingViewSync(true);
  
  return (
    <div>
      <button onClick={() => toggleAutoSync()}>
        {syncEnabled ? 'Disable Auto-Sync' : 'Enable Auto-Sync'}
      </button>
      <button onClick={() => manualSync()} disabled={isSyncing}>
        {isSyncing ? 'Syncing...' : 'Manual Sync'}
      </button>
    </div>
  );
}
```

## Data Flow Architecture

The TradingView integration follows this data flow:

1. **Authentication Layer** (`use-tradingview-auth.ts`)
   - Manages credentials and connection state
   - Provides connect/disconnect methods

2. **Sync Layer** (`use-tradingview-sync.ts`)
   - Handles real-time data synchronization
   - Controls automatic and manual sync operations

3. **Data Layer** (`use-tradingview-data.ts`)
   - Provides methods to fetch different types of data
   - Handles caching and data transformation

4. **Integration Layer** (`use-tradingview-integration.ts`)
   - Combines auth, sync, and data layers
   - Provides a unified API for components

5. **Presentation Layer** (`TradingViewChart.tsx`, `ChartRenderer.tsx`, etc.)
   - Renders data with appropriate visualizations
   - Handles user interactions and chart controls

## Best Practices

### Performance Optimization

For optimal performance when working with chart components:

- Memoize callbacks and computed values
- Limit the number of data points when not necessary
- Use appropriate timeframes for different view contexts
- Implement virtualization for lists of charts

### Error Handling

The integration includes comprehensive error handling:

- Connection errors are displayed to users with appropriate guidance
- Data fetch errors are gracefully handled with fallback UI
- Sync errors are reported with options to retry

### Extending the System

To add new chart types or indicators:

1. Create a new chart component extending the `ChartBaseProps` interface
2. Add the component to `ChartRenderer.tsx`
3. Update the chart type selector in `TradingViewChart.tsx`

### Backward Compatibility

The system maintains backward compatibility through:

- Type-safe interfaces that extend previous versions
- Fallback values for new properties
- Conditional rendering based on feature availability

## Environment Setup

To use the TradingView integration:

1. Ensure you have a valid TradingView account
2. Configure the connection in the TradingView Integration page
3. Enable auto-sync or perform manual syncs as needed

## Troubleshooting

If you encounter issues with the TradingView integration:

1. **Connection Problems**
   - Verify your TradingView credentials
   - Check internet connectivity
   - Clear localStorage and try reconnecting

2. **Sync Issues**
   - Try a manual sync to reset the sync state
   - Disable and re-enable auto-sync
   - Check console for specific error messages

3. **Chart Rendering Issues**
   - Verify the symbol format is correct
   - Try different timeframes
   - Check if data is available for the selected asset

## Additional Resources

- [TradingView API Documentation](https://www.tradingview.com/rest-api-spec/)
- [Recharts Documentation](https://recharts.org/en-US/) (used for chart rendering)
- [React Query Documentation](https://tanstack.com/query/latest) (used for data fetching)

## Contributing

When contributing to the project, please follow these guidelines:

- Maintain type safety with proper TypeScript interfaces
- Document hooks and components with JSDoc comments
- Write unit tests for new hooks and components
- Follow the existing architecture pattern

## Future Enhancements

Planned improvements for the TradingView integration:

- WebSocket-based real-time updates
- Custom indicator development
- Advanced pattern recognition algorithms
- Integration with trading execution platforms
