
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TwitterFormFields from '../TwitterFormFields';
import { twitterFormSchema } from '@/hooks/useTwitterConnect';
import userEvent from '@testing-library/user-event';

const TestFormWrapper = () => {
  const form = useForm({
    resolver: zodResolver(twitterFormSchema),
    defaultValues: {
      apiKey: '',
      apiSecret: '',
      bearerToken: ''
    }
  });

  return (
    <Form {...form}>
      <form>
        <TwitterFormFields form={form} />
      </form>
    </Form>
  );
};

describe('TwitterFormFields', () => {
  it('renders all form fields', () => {
    render(<TestFormWrapper />);
    expect(screen.getByLabelText(/API Key/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/API Secret/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bearer Token/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<TestFormWrapper />);
    const apiKeyInput = screen.getByLabelText(/API Key/i);
    await userEvent.type(apiKeyInput, 'short');
    await userEvent.tab();
    
    expect(await screen.findByText(/API Key is required and must be valid/i)).toBeInTheDocument();
  });

  it('masks sensitive fields', () => {
    render(<TestFormWrapper />);
    const apiSecretInput = screen.getByLabelText(/API Secret/i);
    const bearerTokenInput = screen.getByLabelText(/Bearer Token/i);
    
    expect(apiSecretInput).toHaveAttribute('type', 'password');
    expect(bearerTokenInput).toHaveAttribute('type', 'password');
  });
});
