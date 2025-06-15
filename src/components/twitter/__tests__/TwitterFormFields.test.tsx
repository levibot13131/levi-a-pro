
import React from 'react';
import { render } from '@testing-library/react';
import TwitterFormFields from '../TwitterFormFields';

describe('TwitterFormFields', () => {
  it('renders without crashing', () => {
    const mockProps = {
      consumerKey: '',
      consumerSecret: '',
      accessToken: '',
      accessTokenSecret: '',
      onConsumerKeyChange: jest.fn(),
      onConsumerSecretChange: jest.fn(),
      onAccessTokenChange: jest.fn(),
      onAccessTokenSecretChange: jest.fn(),
    };
    
    render(<TwitterFormFields {...mockProps} />);
  });
});
