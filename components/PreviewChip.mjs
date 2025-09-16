// components/PreviewChip.mjs
import React from 'react';
export function PreviewChip({ url }) {
  if (!url) return React.createElement('span', { style:{ padding:'2px 6px', border:'1px solid #ccc', borderRadius: '8px' } }, 'no preview');
  return React.createElement('a', { href:url, target:'_blank', rel:'noreferrer', style:{ padding:'2px 6px', border:'1px solid #0a0', borderRadius: '8px' } }, 'Preview');
}
