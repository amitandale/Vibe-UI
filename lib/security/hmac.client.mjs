// lib/security/hmac.client.mjs
import crypto from 'node:crypto';

/** Return hex HMAC of body string using VIBE_HMAC_SECRET. */
export function signBodyHex(body=''){
  const secret = process.env.VIBE_HMAC_SECRET || '';
  if (!secret) return '';
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}
