
import '@testing-library/jest-dom';

declare global {
  namespace Vi {
    interface Assertion {
      toBeInTheDocument(): Assertion;
      toHaveAttribute(name: string, value?: string): Assertion;
      toBeDisabled(): Assertion;
      // Add any other matchers you need
    }
  }
}
