
# Architecture Diagrams

## Diagram Legend

### Color Coding

The architecture diagrams use a consistent color palette to represent different layers and services:

- **Blue (#3b82f6)**: TradingView-related components and services
  - Represents authentication, data synchronization, and chart-related functionality

- **Purple (#8b5cf6)**: Binance-related components and services
  - Indicates WebSocket connections, market data, and Binance-specific integrations

- **Green (#10b981)**: Twitter and Social Data components
  - Highlights social media integration, sentiment analysis, and external data sources

- **Gray (#94a3b8)**: Architectural connections and generic services
  - Used for interconnections between layers, service boundaries, and general infrastructure

### Visual Elements

#### Rectangles and Boxes

- **Solid Rectangles**: Primary service or component containers
- **Rounded Corners**: Indicates a modular, self-contained component
- **Opacity Variations**: Represents hierarchical or nested components
  - Full opacity: Main service layer
  - Reduced opacity: Sub-components or specialized services

#### Connection Lines

- **Solid Lines**: Direct data flow or functional dependencies
- **Dashed Lines**: External API calls or optional/conditional connections

#### Icons and Symbols

While the current diagrams don't use icons, future iterations may include:
- 🔒 Authentication-related components
- 🔄 Synchronization or real-time update services
- 📊 Data visualization and charting components

### Interpreting the Diagrams

1. **Layer Progression**: 
   - Left to Right: External Services → Service Layer → Hook Layer → Component Layer
   - Top to Bottom: Architectural hierarchy and data flow

2. **Color Flow**: 
   - Follow the color-coded components to trace service-specific interactions
   - Blue (TradingView) → Purple (Binance) → Green (Twitter)

3. **Line Connections**:
   - Solid lines show direct, critical dependencies
   - Dashed lines indicate optional or external interactions

## Extending the Diagrams

### For Contributors

When adding new components or services to the architecture:

1. Respect the existing color coding
2. Maintain the layer-based structure
3. Use dashed lines for optional or external connections
4. Add sub-components with reduced opacity
5. Keep the visual hierarchy clear

### Updating Process

- Fork the project
- Edit the SVG files in a vector graphics editor
- Maintain the established visual language
- Update the legend in `diagrams.md` to reflect any new visual elements

## Examples of Future Extensions

- Adding a new data source (e.g., CoinMarketCap)
- Introducing a new hook for specialized data processing
- Creating additional integration layers

```

