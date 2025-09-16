import { render, screen, fireEvent } from '@testing-library/react';
import TestersPage from '../../app/testers/page';

global.fetch = async () => new Response(JSON.stringify({ items: [] }), { status:200, headers:{'content-type':'application/json'} });

test('renders Testers page and invite controls', async () => {
  render(<TestersPage />);
  expect(await screen.findByText(/Testers/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByText('Invite')).toBeInTheDocument();
});
