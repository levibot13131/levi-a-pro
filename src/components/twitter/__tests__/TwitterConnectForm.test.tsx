
import React from 'react';
import { render } from '@testing-library/react';
import TwitterConnectForm from '../TwitterConnectForm';

describe('TwitterConnectForm', () => {
  it('renders without crashing', () => {
    render(<TwitterConnectForm />);
  });
});
