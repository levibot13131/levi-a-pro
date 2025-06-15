
import React from 'react';
import { render } from '@testing-library/react';
import TwitterFormFields from '../TwitterFormFields';
import { vi, describe, it } from 'vitest';
import { useForm } from 'react-hook-form';

// Mock useForm hook
vi.mock('react-hook-form', () => ({
  useForm: vi.fn()
}));

describe('TwitterFormFields', () => {
  it('renders without crashing', () => {
    const mockForm = {
      register: vi.fn(),
      handleSubmit: vi.fn(),
      formState: { errors: {} },
      watch: vi.fn(),
      setValue: vi.fn(),
      getValues: vi.fn(),
      reset: vi.fn(),
      control: {},
      getFieldState: vi.fn(),
      setError: vi.fn(),
      clearErrors: vi.fn(),
      trigger: vi.fn(),
      unregister: vi.fn(),
      setFocus: vi.fn()
    };

    (useForm as any).mockReturnValue(mockForm);

    const mockProps = {
      form: mockForm
    };
    
    render(<TwitterFormFields {...mockProps} />);
  });
});
