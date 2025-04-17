
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TwitterConnectForm from '../TwitterConnectForm';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('TwitterConnectForm', () => {
  const mockOnConnect = vi.fn();
  const mockOnDisconnect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders connect form in disconnected state', () => {
    render(
      <TwitterConnectForm
        isConnected={false}
        onConnect={mockOnConnect}
      />
    );
    
    expect(screen.getByText(/התחברות לטוויטר/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /התחבר/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /התנתק/i })).not.toBeInTheDocument();
  });

  it('renders disconnect button when connected', () => {
    render(
      <TwitterConnectForm
        isConnected={true}
        onConnect={mockOnConnect}
        onDisconnect={mockOnDisconnect}
      />
    );
    
    expect(screen.getByRole('button', { name: /התנתק/i })).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    render(<TwitterConnectForm onConnect={mockOnConnect} />);
    
    await userEvent.type(screen.getByLabelText(/API Key/i), 'valid-api-key-12345');
    await userEvent.type(screen.getByLabelText(/API Secret/i), 'valid-api-secret-12345');
    await userEvent.type(screen.getByLabelText(/Bearer Token/i), 'valid-bearer-token-12345');
    
    fireEvent.click(screen.getByRole('button', { name: /התחבר/i }));
    
    await waitFor(() => {
      expect(mockOnConnect).toHaveBeenCalledWith({
        apiKey: 'valid-api-key-12345',
        apiSecret: 'valid-api-secret-12345',
        bearerToken: 'valid-bearer-token-12345'
      });
    });
  });

  it('handles disconnect action', async () => {
    render(
      <TwitterConnectForm
        isConnected={true}
        onConnect={mockOnConnect}
        onDisconnect={mockOnDisconnect}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /התנתק/i }));
    expect(mockOnDisconnect).toHaveBeenCalled();
  });

  it('shows validation errors for invalid input', async () => {
    render(<TwitterConnectForm onConnect={mockOnConnect} />);
    
    await userEvent.type(screen.getByLabelText(/API Key/i), 'short');
    fireEvent.click(screen.getByRole('button', { name: /התחבר/i }));
    
    expect(await screen.findByText(/API Key is required and must be valid/i)).toBeInTheDocument();
  });

  it('disables submit button while submitting', async () => {
    render(<TwitterConnectForm onConnect={async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    }} />);
    
    await userEvent.type(screen.getByLabelText(/API Key/i), 'valid-api-key-12345');
    await userEvent.type(screen.getByLabelText(/API Secret/i), 'valid-api-secret-12345');
    await userEvent.type(screen.getByLabelText(/Bearer Token/i), 'valid-bearer-token-12345');
    
    fireEvent.click(screen.getByRole('button', { name: /התחבר/i }));
    
    expect(screen.getByRole('button', { name: /מתחבר/i })).toBeDisabled();
  });
});
