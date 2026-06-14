import { render, screen } from '@testing-library/react';
import App from './App';

test('renders onboarding welcome screen', () => {
  render(<App />);
  const headline = screen.getByText(/Learn Anything/i);
  expect(headline).toBeInTheDocument();
});
