
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useTwitterConnect } from '../useTwitterConnect';
import { getTwitterCredentials } from '@/services/twitter/twitterService';

vi.mock('@/services/twitter/twitterService', () => ({
  getTwitterCredentials: vi.fn()
}));

describe('useTwitterConnect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    (getTwitterCredentials as ReturnType<typeof vi.fn>).mockReturnValue(null);
    const { result } = renderHook(() => useTwitterConnect());
    
    expect(result.current.defaultValues).toEqual({
      apiKey: '',
      apiSecret: '',
      bearerToken: ''
    });
    expect(result.current.isSubmitting).toBe(false);
  });

  it('loads saved credentials if available', () => {
    const mockCredentials = {
      apiKey: 'test-key',
      apiSecret: 'test-secret',
      bearerToken: 'test-token'
    };
    
    (getTwitterCredentials as ReturnType<typeof vi.fn>).mockReturnValue(mockCredentials);
    const { result } = renderHook(() => useTwitterConnect());
    
    expect(result.current.defaultValues).toEqual(mockCredentials);
  });

  it('validates form schema correctly', async () => {
    const { result } = renderHook(() => useTwitterConnect());
    
    const validData = {
      apiKey: 'valid-api-key-12345',
      apiSecret: 'valid-api-secret-12345',
      bearerToken: 'valid-bearer-token-12345'
    };
    
    const parseResult = result.current.twitterFormSchema.safeParse(validData);
    expect(parseResult.success).toBe(true);
  });

  it('handles submission state', () => {
    const { result } = renderHook(() => useTwitterConnect());
    
    act(() => {
      result.current.setIsSubmitting(true);
    });
    
    expect(result.current.isSubmitting).toBe(true);
  });
});
