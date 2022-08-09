import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
<<<<<<< HEAD
  const linkElement = screen.getByText(/HEADLESS CHECKOUT/i);
=======
  const linkElement = screen.getByText(/headless-checkout/i);
>>>>>>> f23a175fcf59ef5c811973de2946c95747069318
  expect(linkElement).toBeInTheDocument();
});
