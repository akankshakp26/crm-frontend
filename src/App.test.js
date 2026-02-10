import { render, screen } from '@testing-library/react';
import App from './App';


test('renders Performance Overview heading', () => {
  render(<App />);
  const heading = screen.getByText(/performance overview/i);
  expect(heading).toBeInTheDocument();
});
