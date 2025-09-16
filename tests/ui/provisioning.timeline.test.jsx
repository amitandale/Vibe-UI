import { render, screen } from '@testing-library/react';
import ProjectStatusPage from '../../app/projects/[id]/page';

process.env.NEXT_PUBLIC_CI_URL = 'https://ci.example.com';

class FakeES {
  constructor(url){ this.url = url; setTimeout(()=>{
    this.onmessage && this.onmessage({ data: JSON.stringify({ ok:true, type:'STATUS', job: { state:'DRAFT', steps:[
      { key:'VALIDATING_TOKENS', status:'RUNNING' },
      { key:'CREATING_REPO', status:'PENDING' },
      { key:'PUSHING_SKELETON', status:'PENDING' },
      { key:'VERIFYING', status:'PENDING' },
    ] } }) });
  }, 5); }
  close(){}
}

global.EventSource = FakeES;

test('timeline renders steps', async () => {
  render(<ProjectStatusPage params={{ id:'job1' }} />);
  expect(await screen.findByText(/Validating tokens/i)).toBeInTheDocument();
  expect(await screen.findByText(/Creating repo/i)).toBeInTheDocument();
});
