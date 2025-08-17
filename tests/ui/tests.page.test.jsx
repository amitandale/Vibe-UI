import { render, screen } from '@testing-library/react';
import TestsAssigned from '../../app/tests/page';

global.fetch = async () => new Response(JSON.stringify({ items: [] }), { status:200, headers:{'content-type':'application/json'} });

test('renders Assigned Tests page', async () => {
  render(<TestsAssigned />);
  expect(await screen.findByText(/My Assigned Tests/i)).toBeInTheDocument();
});
