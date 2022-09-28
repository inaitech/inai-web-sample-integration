import { render, screen } from '@testing-library/react';
import App from './App';

test('renders headless checkout', () => {
  render(<App />);
  const linkElement = screen.getByText(/headless checkout/i);
  expect(linkElement).toBeInTheDocument();
});
