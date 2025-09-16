import { render, screen, fireEvent } from '@testing-library/react';
import NewProjectPage from '../../app/projects/new/page';

// ensure env for API helper
process.env.NEXT_PUBLIC_CI_URL = 'https://ci.example.com';

test('wizard validates basics and proceeds', async () => {
  render(<NewProjectPage />);
  // Step 0: basics
  expect(screen.getByText(/New Project/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText('Next')); // should block
  expect(screen.getByText(/Owner and repo are required/i)).toBeInTheDocument();

  // fill fields
  fireEvent.change(screen.getByLabelText('Owner'), { target: { value: 'acme' } });
  fireEvent.change(screen.getByLabelText('Repo'), { target: { value: 'web' } });
  fireEvent.click(screen.getByText('Next'));
  // Step 1: CI profile visible
  expect(screen.getByLabelText('Level')).toBeInTheDocument();
  expect(screen.getByLabelText('Coverage')).toBeInTheDocument();
});
