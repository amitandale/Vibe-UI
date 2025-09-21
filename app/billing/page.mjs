export const dynamic = 'force-dynamic';

import BillingClient from './client.mjs';

export default async function BillingPage(){
  // Server side just shells the client. Data is fetched client-side to keep HMAC on server proxy.
  return <BillingClient />;
}
