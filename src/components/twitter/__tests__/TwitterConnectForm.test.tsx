
import React from 'react';
import { render } from '@testing-library/react';
import TwitterConnectForm from '../TwitterConnectForm';
import { vi, describe, it } from 'vitest';

describe('TwitterConnectForm', () => {
  it('renders without crashing', () => {
    const mockOnConnect = vi.fn();
    render(<TwitterConnectForm onConnect={mockOnConnect} />);
  });
});
